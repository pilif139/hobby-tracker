package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetFeed200Response;
import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsHobby200Response;
import com.filip.hobbytracker.api.generated.model.GetFeedFollowSuggestionsSocial200Response;
import com.filip.hobbytracker.api.generated.model.GetFeedHobbySuggestions200Response;
import com.filip.hobbytracker.api.generated.model.PostFollow200Response;
import com.filip.hobbytracker.api.generated.model.PostFollowRequest;

import java.util.concurrent.ExecutorService;

public class FeedRepository extends BaseRepository {

    public FeedRepository(Context context, ExecutorService executor) {
        super(context, executor);
    }

    public void getFeed(Integer limit, String cursor, Callback<GetFeed200Response> callback) {
        executeRequest(() -> ApiProvider.feedApi().getFeed(limit, cursor), callback, R.string.error_network);
    }

    public void getHobbyFollowSuggestions(Integer limit, Callback<GetFeedFollowSuggestionsHobby200Response> callback) {
        executeRequest(() -> ApiProvider.feedApi().getFeedFollowSuggestionsHobby(limit), callback, R.string.error_network);
    }

    public void getSocialFollowSuggestions(Integer limit, Callback<GetFeedFollowSuggestionsSocial200Response> callback) {
        executeRequest(() -> ApiProvider.feedApi().getFeedFollowSuggestionsSocial(limit), callback, R.string.error_network);
    }

    public void getHobbySuggestions(Integer limit, Callback<GetFeedHobbySuggestions200Response> callback) {
        executeRequest(() -> ApiProvider.feedApi().getFeedHobbySuggestions(limit, null), callback, R.string.error_network);
    }

    public void followUser(String followerId, String followingId, Callback<PostFollow200Response> callback) {
        executeRequest(() -> {
            PostFollowRequest req = new PostFollowRequest();
            req.setFollowerId(followerId);
            req.setFollowingId(followingId);
            return ApiProvider.followApi().postFollow(req);
        }, callback, R.string.error_network);
    }
}
