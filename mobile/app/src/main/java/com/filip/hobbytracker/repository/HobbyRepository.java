package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import java.util.List;
import java.util.concurrent.ExecutorService;

public class HobbyRepository extends BaseRepository {

    public HobbyRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getHobbies(Callback<List<Object>> callback) {
        executeRequest(() -> ApiProvider.hobbyApi().getHobby(null, null, null), callback, R.string.error_network);
    }
}
