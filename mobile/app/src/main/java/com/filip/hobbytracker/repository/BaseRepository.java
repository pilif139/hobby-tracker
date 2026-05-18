package com.filip.hobbytracker.repository;

import android.content.Context;

import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.invoker.ApiException;

import java.util.concurrent.ExecutorService;

public abstract class BaseRepository {

    protected final ExecutorService executor;
    protected final Context context;

    public BaseRepository(Context context, ExecutorService executor) {
        this.context = context.getApplicationContext();
        this.executor = executor;
    }

    public interface ApiCall<T> {
        T execute() throws ApiException, Exception;
    }

    public interface Callback<T> {
        void onResult(Resource<T> result);
    }

    protected <T> void executeRequest(ApiCall<T> apiCall, Callback<T> callback, int defaultErrorResId) {
        callback.onResult(Resource.loading(null));

        executor.execute(() -> {
            try {
                T result = apiCall.execute();
                callback.onResult(Resource.success(result));
            } catch (ApiException e) {
                String errorMessage = context.getString(defaultErrorResId);
                if (e.getResponseBody() != null && !e.getResponseBody().trim().isEmpty()) {
                    errorMessage = e.getResponseBody();
                }
                callback.onResult(Resource.error(errorMessage, null));
            } catch (Exception e) {
                callback.onResult(Resource.error(context.getString(R.string.error_network), null));
            }
        });
    }
}