package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetFeed200Response;

import java.util.concurrent.ExecutorService;

public class FeedRepository extends BaseRepository {

    public FeedRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getFeed(Integer limit, String cursor, Callback<GetFeed200Response> callback) {
        executeRequest(() -> ApiProvider.feedApi().getFeed(limit, cursor), callback, R.string.error_network);
    }
}
