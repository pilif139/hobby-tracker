package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseStats;
import com.filip.hobbytracker.api.generated.model.GetHobbyUserByUserId200ResponseInner;
import com.filip.hobbytracker.repository.Resource;
import com.filip.hobbytracker.repository.UserRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DashboardFragment extends Fragment {

    private UserRepository userRepository;
    private final ExecutorService executor = Executors.newFixedThreadPool(2);

    private ProgressBar statsProgress;
    private ProgressBar hobbiesProgress;
    private LinearLayout layoutStats;
    private LinearLayout layoutHobbies;
    private TextView statsEmpty;
    private TextView statsError;
    private TextView hobbiesEmpty;
    private TextView hobbiesError;

    private TextView statSessionsValue;
    private TextView statSessionsSub;
    private TextView statTimeValue;
    private TextView statTimeSub;
    private TextView statStreakValue;
    private TextView statStreakSub;
    private TextView statActiveDaysValue;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_dashboard, container, false);

        statsProgress = view.findViewById(R.id.statsProgress);
        hobbiesProgress = view.findViewById(R.id.hobbiesProgress);
        layoutStats = view.findViewById(R.id.layoutStats);
        layoutHobbies = view.findViewById(R.id.layoutHobbies);
        statsEmpty = view.findViewById(R.id.statsEmpty);
        statsError = view.findViewById(R.id.statsError);
        hobbiesEmpty = view.findViewById(R.id.hobbiesEmpty);
        hobbiesError = view.findViewById(R.id.hobbiesError);

        statSessionsValue = view.findViewById(R.id.statSessionsValue);
        statSessionsSub = view.findViewById(R.id.statSessionsSub);
        statTimeValue = view.findViewById(R.id.statTimeValue);
        statTimeSub = view.findViewById(R.id.statTimeSub);
        statStreakValue = view.findViewById(R.id.statStreakValue);
        statStreakSub = view.findViewById(R.id.statStreakSub);
        statActiveDaysValue = view.findViewById(R.id.statActiveDaysValue);

        userRepository = new UserRepository(requireContext(), Executors.newSingleThreadExecutor());

        statsProgress.setVisibility(View.VISIBLE);
        hobbiesProgress.setVisibility(View.VISIBLE);

        userRepository.getCurrentUser(resource -> {
            if (getActivity() == null) return;
            if (resource.status == Resource.Status.LOADING) return;
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                String userId = resource.data.getId().toString();
                loadStats(userId);
                loadHobbies(userId);
            } else {
                requireActivity().runOnUiThread(() -> {
                    showStatsError();
                    showHobbiesError();
                });
            }
        });

        return view;
    }

    private void loadStats(String userId) {
        executor.execute(() -> {
            try {
                GetHobbySessionUserByUserId200Response response =
                        ApiProvider.hobbySessionApi().getHobbySessionUserByUserId(userId, 1, null, null, null);
                requireActivity().runOnUiThread(() -> {
                    statsProgress.setVisibility(View.GONE);
                    GetHobbySessionUserByUserId200ResponseStats stats = response.getStats();
                    if (stats == null || stats.getTotalCount().compareTo(BigDecimal.ZERO) == 0) {
                        statsEmpty.setVisibility(View.VISIBLE);
                    } else {
                        bindStats(stats);
                        layoutStats.setVisibility(View.VISIBLE);
                    }
                });
            } catch (Exception e) {
                if (getActivity() != null) requireActivity().runOnUiThread(this::showStatsError);
            }
        });
    }

    private void loadHobbies(String userId) {
        executor.execute(() -> {
            try {
                List<GetHobbyUserByUserId200ResponseInner> hobbies =
                        ApiProvider.hobbyApi().getHobbyUserByUserId(userId);
                requireActivity().runOnUiThread(() -> {
                    hobbiesProgress.setVisibility(View.GONE);
                    if (hobbies == null || hobbies.isEmpty()) {
                        hobbiesEmpty.setVisibility(View.VISIBLE);
                    } else {
                        bindHobbies(hobbies);
                        layoutHobbies.setVisibility(View.VISIBLE);
                    }
                });
            } catch (Exception e) {
                if (getActivity() != null) requireActivity().runOnUiThread(this::showHobbiesError);
            }
        });
    }

    private void bindStats(GetHobbySessionUserByUserId200ResponseStats stats) {
        statSessionsValue.setText(String.valueOf(stats.getTotalCount().intValue()));
        statSessionsSub.setText(stats.getSessionsLast30Days().intValue() + " in last 30 days");

        statTimeValue.setText(formatDuration(stats.getTotalDurationInSeconds().longValue()));
        statTimeSub.setText("Avg. " + formatDuration(stats.getAverageDurationInSeconds().longValue()));

        statStreakValue.setText(stats.getCurrentStreakDays().intValue() + " days");
        statStreakSub.setText("Best: " + stats.getLongestStreakDays().intValue() + " days");

        statActiveDaysValue.setText(String.valueOf(stats.getActiveDaysCount().intValue()));
    }

    private void bindHobbies(List<GetHobbyUserByUserId200ResponseInner> hobbies) {
        layoutHobbies.removeAllViews();
        for (GetHobbyUserByUserId200ResponseInner hobby : hobbies) {
            View item = LayoutInflater.from(requireContext())
                    .inflate(R.layout.item_dashboard_hobby, layoutHobbies, false);
            ((TextView) item.findViewById(R.id.hobbyName)).setText(
                    hobby.getName() != null ? hobby.getName() : "Unnamed hobby");
            int count = hobby.getSessionCount() != null ? hobby.getSessionCount().intValue() : 0;
            ((TextView) item.findViewById(R.id.hobbySessions)).setText(count + " sessions recorded");
            layoutHobbies.addView(item);
        }
    }

    private void showStatsError() {
        statsProgress.setVisibility(View.GONE);
        statsError.setVisibility(View.VISIBLE);
    }

    private void showHobbiesError() {
        hobbiesProgress.setVisibility(View.GONE);
        hobbiesError.setVisibility(View.VISIBLE);
    }

    private String formatDuration(long seconds) {
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        if (hours > 0) return hours + "h " + minutes + "m";
        return minutes + "m";
    }
}
