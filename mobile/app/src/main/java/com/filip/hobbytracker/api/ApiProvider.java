package com.filip.hobbytracker.api;

import com.filip.hobbytracker.api.generated.api.AuthenticationApi;
import com.filip.hobbytracker.api.generated.api.FeedApi;
import com.filip.hobbytracker.api.generated.api.FollowApi;
import com.filip.hobbytracker.api.generated.api.HealthCheckApi;
import com.filip.hobbytracker.api.generated.api.HobbyApi;
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;
import com.filip.hobbytracker.api.generated.api.UserApi;
import com.filip.hobbytracker.api.invoker.ApiClient;

import okhttp3.OkHttpClient;

public final class ApiProvider {

    private static final String BASE_URL = "http://10.0.2.2:8787";

    private static final ApiClient API_CLIENT;
    private static final AuthenticationApi AUTHENTICATION_API;
    private static final HobbyApi HOBBY_API;
    private static final HobbySessionApi HOBBY_SESSION_API;
    private static final UserApi USER_API;
    private static final HealthCheckApi HEALTH_CHECK_API;
    private static final FeedApi FEED_API;
    private static final FollowApi FOLLOW_API;

    static {
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .cookieJar(new SimpleCookieJar())
                .build();

        API_CLIENT = new ApiClient()
                .setBasePath(BASE_URL)
                .setHttpClient(okHttpClient);

        AUTHENTICATION_API = new AuthenticationApi(API_CLIENT);
        HOBBY_API = new HobbyApi(API_CLIENT);
        HOBBY_SESSION_API = new HobbySessionApi(API_CLIENT);
        USER_API = new UserApi(API_CLIENT);
        HEALTH_CHECK_API = new HealthCheckApi(API_CLIENT);
        FEED_API = new FeedApi(API_CLIENT);
        FOLLOW_API = new FollowApi(API_CLIENT);
    }

    private ApiProvider() {
    }

    public static AuthenticationApi authenticationApi() {
        return AUTHENTICATION_API;
    }

    public static HobbyApi hobbyApi() {
        return HOBBY_API;
    }

    public static HobbySessionApi hobbySessionApi() {
        return HOBBY_SESSION_API;
    }

    public static UserApi userApi() {
        return USER_API;
    }

    public static HealthCheckApi healthCheckApi() {
        return HEALTH_CHECK_API;
    }

    public static FeedApi feedApi() {
        return FEED_API;
    }

    public static FollowApi followApi() {
        return FOLLOW_API;
    }
}
