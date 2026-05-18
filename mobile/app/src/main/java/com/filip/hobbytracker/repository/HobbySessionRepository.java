package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionById200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;

import java.util.List;
import java.util.concurrent.ExecutorService;

public class HobbySessionRepository extends BaseRepository {

    public HobbySessionRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getSessions(String hobbyId, Callback<GetHobbySessionUserByUserId200Response> callback) {
        executeRequest(() -> ApiProvider.hobbySessionApi().getHobbySessionHobbyByHobbyId(hobbyId, null, null, null, null), callback, R.string.error_network);
    }

    public void createSession(String hobbyId, String startTime, String endTime, String notes, List<Object> images, Callback<GetHobbySessionById200Response> callback) {
        executeRequest(() -> ApiProvider.hobbySessionApi().postHobbySession(hobbyId, startTime, endTime, notes, images), callback, R.string.error_network);
    }
}
