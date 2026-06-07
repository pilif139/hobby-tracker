package com.filip.hobbytracker.repository;

import android.content.Context;

import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.PatchUserMeRequest;
import com.filip.hobbytracker.api.generated.model.PostAuthLogin200Response;

import java.io.File;
import java.util.concurrent.ExecutorService;

public class UserRepository extends BaseRepository {

    public UserRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getCurrentUser(Callback<PostAuthLogin200Response> callback) {
        executeRequest(() -> ApiProvider.authenticationApi().getAuthMe(), callback, R.string.error_network);
    }

    public void updateName(String name, Callback<Void> callback) {
        executeRequest(() -> {
            ApiProvider.userApi().patchUserMe(new PatchUserMeRequest().name(name));
            return null;
        }, callback, R.string.error_network);
    }

    public void uploadAvatar(File file, Callback<Void> callback) {
        executeRequest(() -> {
            ApiProvider.userApi().postUserAvatar(file);
            return null;
        }, callback, R.string.error_network);
    }
}
