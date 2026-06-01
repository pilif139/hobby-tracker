package com.filip.hobbytracker;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner;
import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner;
import com.filip.hobbytracker.api.generated.model.GetFeedHobbySuggestions200ResponseSuggestionsInner;
import com.filip.hobbytracker.repository.FeedRepository;
import com.filip.hobbytracker.repository.HobbyRepository;
import com.filip.hobbytracker.repository.Resource;
import com.filip.hobbytracker.repository.UserRepository;
import com.google.android.material.button.MaterialButton;

import java.util.concurrent.Executors;

public class DiscoverFragment extends Fragment {

    private FeedRepository repository;
    private HobbyRepository hobbyRepository;
    private UserRepository userRepository;
    private LinearLayout layoutHobbyFollow;
    private LinearLayout layoutSocialFollow;
    private LinearLayout layoutHobbySuggestions;
    private ProgressBar progressBar;
    private String currentUserId;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_discover, container, false);

        layoutHobbyFollow = view.findViewById(R.id.layoutHobbyFollow);
        layoutSocialFollow = view.findViewById(R.id.layoutSocialFollow);
        layoutHobbySuggestions = view.findViewById(R.id.layoutHobbySuggestions);
        progressBar = view.findViewById(R.id.discoverProgress);

        repository = new FeedRepository(requireContext(), Executors.newSingleThreadExecutor());
        hobbyRepository = new HobbyRepository(requireContext(), Executors.newSingleThreadExecutor());
        userRepository = new UserRepository(requireContext(), Executors.newSingleThreadExecutor());

        progressBar.setVisibility(View.VISIBLE);
        userRepository.getCurrentUser(resource -> {
            if (getActivity() == null) return;
            if (resource.status == Resource.Status.LOADING) return;
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                currentUserId = resource.data.getId().toString();
            }
            getActivity().runOnUiThread(this::loadSuggestions);
        });

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

    private MaterialButton createSuggestionButton(String text) {
        MaterialButton button = new MaterialButton(requireContext());
        button.setText(text);
        button.setAllCaps(false);
        button.setCornerRadius((int) (18 * getResources().getDisplayMetrics().density));
        button.setInsetTop(0);
        button.setInsetBottom(0);
        button.setBackgroundTintList(
                ContextCompat.getColorStateList(requireContext(), R.color.hobby_secondary));
        button.setTextColor(ContextCompat.getColor(requireContext(), R.color.hobby_foreground));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = (int) (8 * getResources().getDisplayMetrics().density);
        button.setLayoutParams(params);
        return button;
    }

    private void loadSuggestions() {
        repository.getHobbyFollowSuggestions(5, resource -> {
            if (getActivity() == null) return;
            if (resource.status == Resource.Status.LOADING) return;
            getActivity().runOnUiThread(() -> {
                if (resource.status == Resource.Status.ERROR) {
                    addEmptyMessage(layoutHobbyFollow, "Failed to load hobby suggestions.");
                    return;
                }

                layoutHobbyFollow.removeAllViews();
                if (resource.data.getSuggestions().isEmpty()) {
                    addEmptyMessage(layoutHobbyFollow, "No suggestions based on your hobby.");
                    return;
                }

                for (GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner user : resource.data.getSuggestions()) {
                    MaterialButton btn = createSuggestionButton(user.getName());
                    String userId = user.getId();
                    if (currentUserId == null) btn.setEnabled(false);
                    btn.setOnClickListener(v -> {
                        btn.setEnabled(false);
                        repository.followUser(currentUserId, userId, res -> {
                            if (getActivity() == null) {
                                return;
                            }
                            if (res.status == Resource.Status.LOADING) return;
                            getActivity().runOnUiThread(() -> {
                                if (res.status == Resource.Status.SUCCESS) {
                                    ViewGroup parent = (ViewGroup) btn.getParent();
                                    if (parent != null) {
                                        parent.removeView(btn);
                                        if (parent.getChildCount() == 0) {
                                            addEmptyMessage(layoutHobbyFollow, "No suggestions based on your hobby.");
                                        }
                                    }
                                } else {
                                    btn.setEnabled(true);
                                    Toast.makeText(getContext(), res.message, Toast.LENGTH_SHORT).show();
                                }
                            });
                        });
                    });
                    layoutHobbyFollow.addView(btn);
                }
            });
        });

        repository.getSocialFollowSuggestions(5, resource -> {
            if (getActivity() == null) return;
            if (resource.status == Resource.Status.LOADING) return;
            getActivity().runOnUiThread(() -> {
                if (resource.status == Resource.Status.ERROR) {
                    addEmptyMessage(layoutSocialFollow, "Failed to load social suggestions.");
                    return;
                }

                layoutSocialFollow.removeAllViews();
                if (resource.data.getSuggestions().isEmpty()) {
                    addEmptyMessage(layoutSocialFollow, "No social suggestions.");
                    return;
                }

                for (GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner user : resource.data.getSuggestions()) {
                    MaterialButton btn = createSuggestionButton(user.getName());
                    String userId = user.getId();
                    if (currentUserId == null) btn.setEnabled(false);
                    btn.setOnClickListener(v -> {
                        btn.setEnabled(false);
                        repository.followUser(currentUserId, userId, res -> {
                            if (getActivity() == null) {
                                return;
                            }
                            if (res.status == Resource.Status.LOADING) return;
                            getActivity().runOnUiThread(() -> {
                                if (res.status == Resource.Status.SUCCESS) {
                                    ViewGroup parent = (ViewGroup) btn.getParent();
                                    if (parent != null) {
                                        parent.removeView(btn);
                                        if (parent.getChildCount() == 0) {
                                            addEmptyMessage(layoutSocialFollow, "No social suggestions");
                                        }
                                    }
                                } else {
                                    btn.setEnabled(true);
                                    Toast.makeText(getContext(), res.message, Toast.LENGTH_SHORT).show();
                                }
                            });
                        });
                    });
                    layoutSocialFollow.addView(btn);
                }
            });
        });

        repository.getHobbySuggestions(5, resource -> {
            if (getActivity() == null) return;
            if (resource.status == Resource.Status.LOADING) return;
            getActivity().runOnUiThread(() -> {
                progressBar.setVisibility(View.GONE);

                if (resource.status == Resource.Status.ERROR) {
                    Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                    return;
                }

                layoutHobbySuggestions.removeAllViews();
                if (resource.data.getSuggestions().isEmpty()) {
                    addEmptyMessage(layoutHobbySuggestions, "No new hobbies to suggest.");
                    return;
                }

                for (GetFeedHobbySuggestions200ResponseSuggestionsInner hobby : resource.data.getSuggestions()) {
                    MaterialButton btn = createSuggestionButton(
                            hobby.getName() + " - " + hobby.getDescription());
                    String hobbyId = hobby.getId();
                    btn.setOnClickListener(v -> {
                        btn.setEnabled(false);
                        hobbyRepository.addHobbyToProfile(hobbyId, res -> {
                            if (getActivity() == null) return;
                            if (res.status == Resource.Status.LOADING) return;
                            getActivity().runOnUiThread(() -> {
                                if (res.status == Resource.Status.SUCCESS) {
                                    ViewGroup parent = (ViewGroup) btn.getParent();
                                    if (parent != null) {
                                        parent.removeView(btn);
                                        if (parent.getChildCount() == 0) {
                                            addEmptyMessage(layoutHobbySuggestions, "No new hobbies to suggest.");
                                        }
                                    }
                                } else {
                                    btn.setEnabled(true);
                                    Toast.makeText(getContext(), res.message, Toast.LENGTH_SHORT).show();
                                }
                            });
                        });
                    });
                    layoutHobbySuggestions.addView(btn);
                }
            });
        });
    }
}
