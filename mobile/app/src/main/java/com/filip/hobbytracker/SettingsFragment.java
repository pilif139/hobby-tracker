package com.filip.hobbytracker;

import android.content.ContentResolver;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.data.local.AppDatabase;
import com.filip.hobbytracker.data.local.UserEntity;
import com.filip.hobbytracker.lib.PreferencesManager;
import com.filip.hobbytracker.repository.AuthRepository;
import com.filip.hobbytracker.repository.Resource;
import com.filip.hobbytracker.repository.UserRepository;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.materialswitch.MaterialSwitch;
import com.google.android.material.textfield.TextInputEditText;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SettingsFragment extends Fragment {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private UserRepository userRepository;
    private AuthRepository authRepository;
    private AppDatabase db;
    private PreferencesManager prefsManager;

    private ImageView avatarImage;
    private ProgressBar avatarProgress;
    private TextInputEditText nameInput;
    private MaterialButton saveNameButton;
    private ProgressBar nameProgress;
    private TextView nameError;
    private MaterialSwitch darkModeSwitch;
    private MaterialButton logoutOtherDevicesButton;
    private ProgressBar logoutOtherProgress;
    private MaterialButton logoutButton;
    private ProgressBar logoutProgress;

    private final ActivityResultLauncher<String> pickImageLauncher =
            registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
                if (uri != null) uploadAvatar(uri);
            });

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_settings, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        userRepository = new UserRepository(requireContext(), executor);
        authRepository = new AuthRepository(requireContext(), executor);
        db = AppDatabase.getDatabase(requireContext());
        prefsManager = PreferencesManager.getInstance(requireContext());

        avatarImage = view.findViewById(R.id.avatarImage);
        avatarProgress = view.findViewById(R.id.avatarProgress);
        nameInput = view.findViewById(R.id.nameInput);
        saveNameButton = view.findViewById(R.id.saveNameButton);
        nameProgress = view.findViewById(R.id.nameProgress);
        nameError = view.findViewById(R.id.nameError);
        darkModeSwitch = view.findViewById(R.id.darkModeSwitch);
        logoutOtherDevicesButton = view.findViewById(R.id.logoutOtherDevicesButton);
        logoutOtherProgress = view.findViewById(R.id.logoutOtherProgress);
        logoutButton = view.findViewById(R.id.logoutButton);
        logoutProgress = view.findViewById(R.id.logoutProgress);

        executor.execute(() -> {
            UserEntity cached = db.userDao().getUser();
            if (getActivity() == null) return;
            requireActivity().runOnUiThread(() -> {
                if (cached != null && cached.name != null) {
                    nameInput.setText(cached.name);
                }
            });
        });

        String cachedAvatarPath = prefsManager.getAvatarPath();
        if (cachedAvatarPath != null) {
            avatarImage.setImageURI(Uri.fromFile(new File(cachedAvatarPath)));
        }

        darkModeSwitch.setChecked(prefsManager.isDarkMode());
        darkModeSwitch.setOnCheckedChangeListener((btn, checked) -> {
            prefsManager.setDarkMode(checked);
            AppCompatDelegate.setDefaultNightMode(
                    checked ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
        });

        saveNameButton.setOnClickListener(v -> saveName());
        view.findViewById(R.id.changeAvatarButton).setOnClickListener(v ->
                pickImageLauncher.launch("image/*"));
        logoutButton.setOnClickListener(v -> logout());
        logoutOtherDevicesButton.setOnClickListener(v -> logoutOtherDevices());
    }

    private void saveName() {
        String name = nameInput.getText() != null ? nameInput.getText().toString().trim() : "";
        if (name.isEmpty()) {
            nameError.setText("Name cannot be empty.");
            nameError.setVisibility(View.VISIBLE);
            return;
        }
        nameError.setVisibility(View.GONE);
        setNameLoading(true);

        userRepository.updateName(name, result -> {
            if (getActivity() == null) return;
            requireActivity().runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) return;
                setNameLoading(false);
                if (result.status == Resource.Status.SUCCESS) {
                    executor.execute(() -> {
                        UserEntity cached = db.userDao().getUser();
                        if (cached != null) {
                            db.userDao().insertUser(new UserEntity(cached.id, name, cached.email));
                        }
                    });
                    Toast.makeText(requireContext(), "Name updated.", Toast.LENGTH_SHORT).show();
                } else {
                    nameError.setText(result.message != null ? result.message : getString(R.string.error_network));
                    nameError.setVisibility(View.VISIBLE);
                }
            });
        });
    }

    private void uploadAvatar(Uri uri) {
        avatarProgress.setVisibility(View.VISIBLE);
        executor.execute(() -> {
            try {
                File tempFile = uriToTempFile(uri);
                if (getActivity() == null) return;
                userRepository.uploadAvatar(tempFile, result -> {
                    if (getActivity() == null) return;
                    requireActivity().runOnUiThread(() -> {
                        if (result.status == Resource.Status.LOADING) return;
                        avatarProgress.setVisibility(View.GONE);
                        if (result.status == Resource.Status.SUCCESS) {
                            avatarImage.setImageURI(uri);
                            executor.execute(() -> {
                                try {
                                    File persistent = new File(requireContext().getFilesDir(), "avatar.jpg");
                                    File temp = uriToTempFile(uri);
                                    try (java.io.InputStream in = new java.io.FileInputStream(temp);
                                         FileOutputStream out = new FileOutputStream(persistent)) {
                                        byte[] buf = new byte[4096];
                                        int len;
                                        while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
                                    }
                                    prefsManager.setAvatarPath(persistent.getAbsolutePath());
                                } catch (Exception ignored) {}
                            });
                            Toast.makeText(requireContext(), "Avatar updated.", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(requireContext(),
                                    result.message != null ? result.message : getString(R.string.error_network),
                                    Toast.LENGTH_SHORT).show();
                        }
                    });
                });
            } catch (Exception e) {
                if (getActivity() != null) {
                    requireActivity().runOnUiThread(() -> {
                        avatarProgress.setVisibility(View.GONE);
                        Toast.makeText(requireContext(), getString(R.string.error_network), Toast.LENGTH_SHORT).show();
                    });
                }
            }
        });
    }

    private File uriToTempFile(Uri uri) throws Exception {
        ContentResolver cr = requireContext().getContentResolver();
        String mime = cr.getType(uri);
        String ext = mime != null && mime.contains("png") ? ".png" : ".jpg";
        File temp = File.createTempFile("avatar", ext, requireContext().getCacheDir());
        try (InputStream in = cr.openInputStream(uri);
             FileOutputStream out = new FileOutputStream(temp)) {
            byte[] buf = new byte[4096];
            int len;
            while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
        }
        return temp;
    }

    private void logout() {
        setLogoutLoading(true);
        authRepository.logout(result -> {
            if (getActivity() == null) return;
            requireActivity().runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) return;
                setLogoutLoading(false);
                executor.execute(() -> {
                    db.userDao().clearUser();
                    boolean wasDarkMode = prefsManager.isDarkMode();
                    prefsManager.clear();
                    prefsManager.setDarkMode(wasDarkMode);
                    if (getActivity() != null) {
                        requireActivity().runOnUiThread(() ->
                                ((MainActivity) requireActivity()).navigateHome(new OnboardFragment()));
                    }
                });
            });
        });
    }

    private void logoutOtherDevices() {
        logoutOtherDevicesButton.setEnabled(false);
        logoutOtherProgress.setVisibility(View.VISIBLE);
        authRepository.logoutOtherDevices(result -> {
            if (getActivity() == null) return;
            requireActivity().runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) return;
                logoutOtherDevicesButton.setEnabled(true);
                logoutOtherProgress.setVisibility(View.GONE);
                if (result.status == Resource.Status.SUCCESS) {
                    Toast.makeText(requireContext(), "Logged out from other devices.", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(requireContext(),
                            result.message != null ? result.message : getString(R.string.error_network),
                            Toast.LENGTH_SHORT).show();
                }
            });
        });
    }

    private void setNameLoading(boolean loading) {
        saveNameButton.setEnabled(!loading);
        nameProgress.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    private void setLogoutLoading(boolean loading) {
        logoutButton.setEnabled(!loading);
        logoutProgress.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        executor.shutdownNow();
    }
}
