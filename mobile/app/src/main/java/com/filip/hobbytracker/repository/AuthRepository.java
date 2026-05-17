package com.filip.hobbytracker.repository;

import android.content.Context;

import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.PostAuthLoginRequest;
import com.filip.hobbytracker.api.invoker.ApiException;

import java.util.concurrent.ExecutorService;

public class AuthRepository {

    private final ExecutorService executor;
    private final Context context;

    public AuthRepository(Context context, ExecutorService executor) {
        // Use application context to avoid memory leaks if the Activity is destroyed
        this.context = context.getApplicationContext();
        this.executor = executor;
    }

    public interface AuthCallback {
        void onResult(Resource<Void> result);
    }

    public void login(String email, String password, AuthCallback callback) {
        callback.onResult(Resource.loading(null));

        executor.execute(() -> {
            try {
                PostAuthLoginRequest request = new PostAuthLoginRequest()
                        .email(email)
                        .password(password);

                ApiProvider.authenticationApi().postAuthLogin(request);
                callback.onResult(Resource.success(null));
                
            } catch (ApiException e) {
                String errorMessage = context.getString(R.string.error_login_failed);
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