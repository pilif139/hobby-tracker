package com.filip.hobbytracker;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner;
import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner;
import com.filip.hobbytracker.api.generated.model.GetFeedHobbySuggestions200ResponseSuggestionsInner;
import com.filip.hobbytracker.repository.FeedRepository;
import com.filip.hobbytracker.repository.Resource;

import java.util.concurrent.Executors;

public class DiscoverFragment extends Fragment {

    private FeedRepository repository;
    private LinearLayout layoutHobbyFollow;
    private LinearLayout layoutSocialFollow;
    private LinearLayout layoutHobbySuggestions;
    private ProgressBar progressBar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_discover, container, false);

        layoutHobbyFollow = view.findViewById(R.id.layoutHobbyFollow);
        layoutSocialFollow = view.findViewById(R.id.layoutSocialFollow);
        layoutHobbySuggestions = view.findViewById(R.id.layoutHobbySuggestions);
        progressBar = view.findViewById(R.id.discoverProgress);

        repository = new FeedRepository(requireContext(), Executors.newSingleThreadExecutor());

        loadSuggestions();

        return view;
    }

    private void addEmptyMessage(LinearLayout container, String message) {
        container.removeAllViews();
        TextView tv = new TextView(getContext());
        tv.setText(message);
        int padding = (int) (8 * getResources().getDisplayMetrics().density);
        tv.setPadding(0, padding, 0, padding);
        container.addView(tv);
    }

    private void loadSuggestions() {
        progressBar.setVisibility(View.VISIBLE);

        repository.getHobbyFollowSuggestions(5, resource -> {
            if (getActivity() == null) return;
            getActivity().runOnUiThread(() -> {
                if (resource.status == Resource.Status.ERROR) {
                    addEmptyMessage(layoutHobbyFollow, "Failed to load hobby suggestions.");
                    return;
                }

                if (resource.status == Resource.Status.SUCCESS) {
                    layoutHobbyFollow.removeAllViews();
                    if (resource.data.getSuggestions().isEmpty()) {
                        addEmptyMessage(layoutHobbyFollow, "No suggestions based on your hobby.");
                        return;
                    }

                    for (GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner user : resource.data.getSuggestions()) {
                        Button btn = new Button(getContext());
                        btn.setText(user.getName());
                        String name = user.getName();
                        btn.setOnClickListener(v -> Toast.makeText(getContext(), "Follow: " + name, Toast.LENGTH_SHORT).show());
                        layoutHobbyFollow.addView(btn);
                    }
                }
            });
        });

        repository.getSocialFollowSuggestions(5, resource -> {
            if (getActivity() == null) return;
            getActivity().runOnUiThread(() -> {
                if (resource.status == Resource.Status.ERROR) {
                    addEmptyMessage(layoutSocialFollow, "Failed to load social suggestions.");
                    return;
                }

                if (resource.status == Resource.Status.SUCCESS) {
                    layoutSocialFollow.removeAllViews();
                    if (resource.data.getSuggestions().isEmpty()) {
                        addEmptyMessage(layoutSocialFollow, "No social suggestions.");
                        return;
                    }

                    for (GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner user : resource.data.getSuggestions()) {
                        Button btn = new Button(getContext());
                        btn.setText(user.getName());
                        String name = user.getName();
                        btn.setOnClickListener(v -> Toast.makeText(getContext(), "Follow: " + name, Toast.LENGTH_SHORT).show());
                        layoutSocialFollow.addView(btn);
                    }
                }
            });
        });

        repository.getHobbySuggestions(5, resource -> {
            if (getActivity() == null) return;
            getActivity().runOnUiThread(() -> {
                progressBar.setVisibility(View.GONE);

                if (resource.status == Resource.Status.ERROR) {
                    Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                    return;
                }

                if (resource.status == Resource.Status.SUCCESS) {
                    layoutHobbySuggestions.removeAllViews();
                    if (resource.data.getSuggestions().isEmpty()) {
                        addEmptyMessage(layoutHobbySuggestions, "No new hobbies to suggest.");
                        return;
                    }

                    for (GetFeedHobbySuggestions200ResponseSuggestionsInner hobby : resource.data.getSuggestions()) {
                        Button btn = new Button(getContext());
                        btn.setText(hobby.getName() + " - " + hobby.getDescription());
                        String name = hobby.getName();
                        btn.setOnClickListener(v -> Toast.makeText(getContext(), "Hobby: " + name, Toast.LENGTH_SHORT).show());
                        layoutHobbySuggestions.addView(btn);
                    }
                }
            });
        });
    }
}
