package com.filip.hobbytracker.repository;

import android.content.Context;

import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.PostAuthLoginRequest;
import com.filip.hobbytracker.api.generated.model.PostAuthRegisterRequest;
import com.filip.hobbytracker.api.invoker.ApiException;

import java.util.concurrent.ExecutorService;

public class AuthRepository extends BaseRepository {

    public AuthRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void login(String email, String password, Callback<Void> callback) {
        executeRequest(() -> {
            PostAuthLoginRequest request = new PostAuthLoginRequest()
                    .email(email)
                    .password(password);
            ApiProvider.authenticationApi().postAuthLogin(request);
            return null;
        }, callback, R.string.error_login_failed);
    }

    public void register(String name, String email, String password, Callback<Void> callback) {
        executeRequest(() -> {
            PostAuthRegisterRequest request = new PostAuthRegisterRequest()
                    .name(name)
                    .email(email)
                    .password(password);
            ApiProvider.authenticationApi().postAuthRegister(request);
            return null;
        }, callback, R.string.error_registration_failed);
    }
}