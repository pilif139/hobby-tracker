package com.filip.hobbytracker;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.filip.hobbytracker.lib.NetworkUtils;
import com.filip.hobbytracker.repository.FeedRepository;
import com.filip.hobbytracker.repository.HobbySessionRepository;
import com.filip.hobbytracker.repository.Resource;

import java.util.concurrent.Executors;

public class FeedListFragment extends Fragment {

    private static final String TAG = "FeedListFragment";
    private static final int PAGE_SIZE = 20;

    private FeedAdapter adapter;
    private FeedRepository feedRepository;
    private HobbySessionRepository sessionRepository;
    private ProgressBar progressBar;
    private TextView tvEmptyFeed;

    // Online pagination
    private String nextCursor = null;
    private boolean hasMoreOnline = true;
    // Offline pagination
    private int nextOffset = 0;
    private boolean hasMoreOffline = true;

    private boolean isLoading = false;

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

        var executor = Executors.newSingleThreadExecutor();
        feedRepository = new FeedRepository(requireContext(), executor);
        sessionRepository = new HobbySessionRepository(requireContext(), executor);

        getParentFragmentManager().setFragmentResultListener(
                CreateSessionFragment.RESULT_KEY,
                getViewLifecycleOwner(),
                (requestKey, result) -> reloadFeed()
        );

        loadFeed();

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        attachNestedScrollListener(view);
    }

    // Walk up the view hierarchy to find the parent NestedScrollView and attach a scroll listener.
    // RecyclerView has nestedScrollingEnabled=false so its own OnScrollListener never fires.
    private void attachNestedScrollListener(View view) {
        ViewGroup.LayoutParams ignored = view.getLayoutParams();
        View current = view;
        while (current.getParent() instanceof View) {
            View parent = (View) current.getParent();
            if (parent instanceof NestedScrollView) {
                NestedScrollView nsv = (NestedScrollView) parent;
                nsv.setOnScrollChangeListener((NestedScrollView.OnScrollChangeListener) (v, scrollX, scrollY, oldScrollX, oldScrollY) -> {
                    Log.d(TAG, "NestedScrollView scrollY=" + scrollY + " oldScrollY=" + oldScrollY + " isLoading=" + isLoading);
                    if (scrollY <= oldScrollY) return; // not scrolling down
                    View child = v.getChildAt(0);
                    if (child == null) return;
                    int distanceToBottom = child.getBottom() - (v.getHeight() + scrollY);
                    Log.d(TAG, "distanceToBottom=" + distanceToBottom);
                    if (distanceToBottom <= 300) {
                        loadMore();
                    }
                });
                Log.d(TAG, "NestedScrollView scroll listener attached");
                return;
            }
            current = parent;
        }
        Log.w(TAG, "NestedScrollView not found in parent hierarchy");
    }

    private void reloadFeed() {
        Log.d(TAG, "reloadFeed called", new Throwable());
        adapter.clearSessions();
        nextCursor = null;
        hasMoreOnline = true;
        nextOffset = 0;
        hasMoreOffline = true;
        loadFeed();
    }

    private void loadFeed() {
        Log.d(TAG, "loadFeed called: isLoading=" + isLoading + " hasMoreOnline=" + hasMoreOnline
                + " nextCursor=" + nextCursor + " network=" + NetworkUtils.isNetworkAvailable(requireContext()));
        if (isLoading) {
            Log.d(TAG, "loadFeed skipped: already loading");
            return;
        }
        isLoading = true;
        progressBar.setVisibility(View.VISIBLE);

        if (NetworkUtils.isNetworkAvailable(requireContext())) {
            Log.d(TAG, "Fetching online page: cursor=" + nextCursor);
            feedRepository.getFeed(PAGE_SIZE, nextCursor, resource -> {
                if (!isAdded()) return;
                Log.d(TAG, "Feed callback: status=" + resource.status);
                if (resource.status == Resource.Status.LOADING) return;
                requireActivity().runOnUiThread(() -> {
                    if (!isAdded()) return;
                    isLoading = false;
                    progressBar.setVisibility(View.GONE);

                    if (resource.status == Resource.Status.SUCCESS) {
                        int newCount = resource.data.getSessions().size();
                        adapter.addSessions(resource.data.getSessions());
                        nextCursor = resource.data.getNextCursor();
                        hasMoreOnline = nextCursor != null;
                        Log.d(TAG, "Online page loaded: newCount=" + newCount
                                + " totalInAdapter=" + adapter.getItemCount()
                                + " nextCursor=" + nextCursor
                                + " hasMoreOnline=" + hasMoreOnline);
                        tvEmptyFeed.setVisibility(adapter.getItemCount() == 0 ? View.VISIBLE : View.GONE);
                    } else if (resource.status == Resource.Status.ERROR) {
                        Log.e(TAG, "Online feed error: " + resource.message);
                        Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                    }
                });
            });
        } else {
            if (!hasMoreOffline) {
                Log.d(TAG, "loadFeed skipped: no more offline data");
                isLoading = false;
                return;
            }
            Log.d(TAG, "Fetching offline page: offset=" + nextOffset);
            sessionRepository.getUserFeedSessions(PAGE_SIZE, nextOffset, resource -> {
                if (!isAdded()) return;
                if (resource.status == Resource.Status.LOADING) return;
                requireActivity().runOnUiThread(() -> {
                    if (!isAdded()) return;
                    isLoading = false;
                    progressBar.setVisibility(View.GONE);

                    if (resource.status == Resource.Status.SUCCESS) {
                        int newCount = resource.data.size();
                        adapter.addSessions(resource.data);
                        nextOffset += newCount;
                        hasMoreOffline = newCount == PAGE_SIZE;
                        Log.d(TAG, "Offline page loaded: newCount=" + newCount
                                + " nextOffset=" + nextOffset
                                + " hasMoreOffline=" + hasMoreOffline);
                        tvEmptyFeed.setVisibility(adapter.getItemCount() == 0 ? View.VISIBLE : View.GONE);
                    } else if (resource.status == Resource.Status.ERROR) {
                        Log.e(TAG, "Offline feed error: " + resource.message);
                        Toast.makeText(getContext(), resource.message, Toast.LENGTH_SHORT).show();
                    }
                });
            });
        }
    }

    private void loadMore() {
        boolean online = NetworkUtils.isNetworkAvailable(requireContext());
        Log.d(TAG, "loadMore: online=" + online + " hasMoreOnline=" + hasMoreOnline
                + " hasMoreOffline=" + hasMoreOffline + " isLoading=" + isLoading);
        if (online) {
            if (!hasMoreOnline) {
                Log.d(TAG, "loadMore skipped: no more online pages");
                return;
            }
        } else {
            if (!hasMoreOffline) {
                Log.d(TAG, "loadMore skipped: no more offline pages");
                return;
            }
        }
        loadFeed();
    }
}
