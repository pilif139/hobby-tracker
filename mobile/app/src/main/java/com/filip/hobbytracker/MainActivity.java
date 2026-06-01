package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.filip.hobbytracker.data.local.AppDatabase;
import com.filip.hobbytracker.data.local.UserEntity;
import com.filip.hobbytracker.data.sync.SyncManager;
import com.filip.hobbytracker.repository.UserRepository;
import com.filip.hobbytracker.repository.Resource;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNavigationView;
    private UserRepository userRepository;
    private AppDatabase db;
    private final ExecutorService dbExecutor = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        userRepository = new UserRepository(this, Executors.newSingleThreadExecutor());
        db = AppDatabase.getDatabase(this);
        bottomNavigationView = findViewById(R.id.bottom_navigation);

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.navigation_dashboard) {
                switchFragment(new DashboardFragment(), false);
                return true;
            } else if (itemId == R.id.navigation_feed) {
                switchFragment(new FeedFragment(), false);
                return true;
            } else if (itemId == R.id.navigation_discover) {
                switchFragment(new DiscoverFragment(), false);
                return true;
            }
            return false;
        });

        getSupportFragmentManager().addOnBackStackChangedListener(() -> {
            Fragment currentFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
            updateBottomNavVisibility(currentFragment);
        });

        if (savedInstanceState == null) {
            checkAuth();
        }
    }

    private void checkAuth() {
        userRepository.getCurrentUser(resource -> {
            runOnUiThread(() -> {
                if (resource.status == Resource.Status.SUCCESS) {
                    dbExecutor.execute(() -> {
                        db.userDao().insertUser(new UserEntity(resource.data.getId(), resource.data.getName(), resource.data.getEmail()));
                    });
                    SyncManager.scheduleSync(this);
                    switchFragment(new DashboardFragment(), false);
                } else if (resource.status == Resource.Status.UNAUTHORIZED) {
                    dbExecutor.execute(() -> {
                        db.userDao().clearUser();
                        runOnUiThread(() -> switchFragment(new OnboardFragment(), false));
                    });
                } else if (resource.status == Resource.Status.ERROR) {
                    dbExecutor.execute(() -> {
                        UserEntity cachedUser = db.userDao().getUser();
                        runOnUiThread(() -> {
                            if (cachedUser != null) {
                                SyncManager.scheduleSync(this);
                                switchFragment(new DashboardFragment(), false);
                            } else {
                                switchFragment(new OnboardFragment(), false);
                            }
                        });
                    });
                }
            });
        });
    }

    public void switchFragment(Fragment fragment, boolean addToBackStack) {
        var transaction = getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container, fragment);
        if (addToBackStack) {
            transaction.addToBackStack(null);
        }
        transaction.commit();
        updateBottomNavVisibility(fragment);
    }

    public void navigateHome(Fragment fragment) {
        getSupportFragmentManager().popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
        getSupportFragmentManager().executePendingTransactions();
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .commit();
        updateBottomNavVisibility(fragment);
    }

    private void updateBottomNavVisibility(Fragment fragment) {
        if (fragment instanceof DashboardFragment || fragment instanceof FeedFragment || fragment instanceof DiscoverFragment) {
            bottomNavigationView.setVisibility(View.VISIBLE);
        } else {
            bottomNavigationView.setVisibility(View.GONE);
        }
    }
}
