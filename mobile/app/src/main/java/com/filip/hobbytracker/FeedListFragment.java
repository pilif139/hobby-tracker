package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.filip.hobbytracker.repository.FeedRepository;
import com.filip.hobbytracker.repository.Resource;

import java.util.concurrent.Executors;

public class FeedListFragment extends Fragment {

    private FeedAdapter adapter;
    private FeedRepository feedRepository;
    private ProgressBar progressBar;
    private TextView tvEmptyFeed;
    private String nextCursor = null;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_feed_list, container, false);

        RecyclerView rvFeed = view.findViewById(R.id.rvFeed);
        progressBar = view.findViewById(R.id.progressBar);
        tvEmptyFeed = view.findViewById(R.id.tvEmptyFeed);

        adapter = new FeedAdapter();
        rvFeed.setLayoutManager(new LinearLayoutManager(getContext()));
        rvFeed.setAdapter(adapter);

        feedRepository = new FeedRepository(requireContext(), Executors.newSingleThreadExecutor());

        getParentFragmentManager().setFragmentResultListener(
                CreateSessionFragment.RESULT_KEY,
                getViewLifecycleOwner(),
                (requestKey, result) -> reloadFeed()
        );

        loadFeed();

        return view;
    }

    private void reloadFeed() {
        adapter.clearSessions();
        nextCursor = null;
        loadFeed();
    }

    private void loadFeed() {
        progressBar.setVisibility(View.VISIBLE);

        feedRepository.getFeed(20, nextCursor, resource -> {
            requireActivity().runOnUiThread(() -> {
                progressBar.setVisibility(View.GONE);

                if (resource.status == Resource.Status.SUCCESS) {
                    adapter.addSessions(resource.data.getSessions());
                    nextCursor = resource.data.getNextCursor();
                    tvEmptyFeed.setVisibility(adapter.getItemCount() == 0 ? View.VISIBLE : View.GONE);
                } else if (resource.status == Resource.Status.ERROR) {
                    Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}
