package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetHobby200ResponseInner;
import com.filip.hobbytracker.api.generated.model.PostHobby201Response;
import com.filip.hobbytracker.api.generated.model.PostHobbyRequest;

import java.util.List;
import java.util.concurrent.ExecutorService;

public class HobbyRepository extends BaseRepository {

    public HobbyRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getHobbies(Callback<List<GetHobby200ResponseInner>> callback) {
        executeRequest(() -> ApiProvider.hobbyApi().getHobby(null, null, null), callback, R.string.error_network);
    }

    public void searchHobbies(String query, Callback<List<GetHobby200ResponseInner>> callback) {
        executeRequest(() -> ApiProvider.hobbyApi().getHobby(query, null, null), callback, R.string.error_network);
    }

    public void createHobby(String name, Callback<PostHobby201Response> callback) {
        executeRequest(() -> {
            PostHobbyRequest req = new PostHobbyRequest();
            req.setName(name);
            PostHobby201Response created = ApiProvider.hobbyApi().postHobby(req);
            ApiProvider.hobbyApi().postHobbyAddToProfileByHobbyId(created.getId());
            return created;
        }, callback, R.string.error_network);
    }
}
