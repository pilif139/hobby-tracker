package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.filip.hobbytracker.repository.FeedRepository;
import com.filip.hobbytracker.repository.Resource;

import java.util.concurrent.Executors;

public class FeedFragment extends Fragment {

    private FeedAdapter adapter;
    private FeedRepository repository;
    private ProgressBar progressBar;
    private String nextCursor = null;
    private boolean isLoading = false;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_feed, container, false);

        RecyclerView rvFeed = view.findViewById(R.id.rvFeed);
        progressBar = view.findViewById(R.id.progressBar);

        adapter = new FeedAdapter();
        rvFeed.setLayoutManager(new LinearLayoutManager(getContext()));
        rvFeed.setAdapter(adapter);

        repository = new FeedRepository(requireContext(), Executors.newSingleThreadExecutor());

        rvFeed.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (!recyclerView.canScrollVertically(1) && !isLoading && nextCursor != null) {
                    loadFeed();
                }
            }
        });

        loadFeed();

        return view;
    }

    private void loadFeed() {
        isLoading = true;
        progressBar.setVisibility(View.VISIBLE);

        repository.getFeed(20, nextCursor, resource -> {
            requireActivity().runOnUiThread(() -> {
                isLoading = false;
                progressBar.setVisibility(View.GONE);

                if (resource.status == Resource.Status.SUCCESS) {
                    adapter.addSessions(resource.data.getSessions());
                    nextCursor = resource.data.getNextCursor();
                } else if (resource.status == Resource.Status.ERROR) {
                    Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}