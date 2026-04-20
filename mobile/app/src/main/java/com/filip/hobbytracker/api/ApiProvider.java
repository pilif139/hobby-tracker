package com.filip.hobbytracker.api;

import com.filip.hobbytracker.api.generated.api.AuthenticationApi;
import com.filip.hobbytracker.api.invoker.ApiClient;

import okhttp3.OkHttpClient;

public final class ApiProvider {

    private static final String BASE_URL = "http://10.0.2.2:8787";

    private static final ApiClient API_CLIENT;
    private static final AuthenticationApi AUTHENTICATION_API;

    static {
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .cookieJar(new SimpleCookieJar())
                .build();

        API_CLIENT = new ApiClient()
                .setBasePath(BASE_URL)
                .setHttpClient(okHttpClient);

        AUTHENTICATION_API = new AuthenticationApi(API_CLIENT);
    }

    private ApiProvider() {
    }

    public static AuthenticationApi authenticationApi() {
        return AUTHENTICATION_API;
    }
}
