package com.filip.hobbytracker.api;

import android.util.Log;

import androidx.annotation.NonNull;

import com.filip.hobbytracker.HobbyTrackerApp;
import com.filip.hobbytracker.lib.PreferencesManager;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;

public class SimpleCookieJar implements CookieJar {

    private static final String COOKIES_KEY = "cookies_map";
    private final Gson gson = new Gson();

    private Map<String, List<Cookie>> getCookieStore() {
        String json = PreferencesManager.getInstance(HobbyTrackerApp.getContext())
                .getSharedPreferences().getString(COOKIES_KEY, null);
        if (json == null) return new HashMap<>();
        return gson.fromJson(json, new TypeToken<Map<String, List<Cookie>>>(){}.getType());
    }

    private void saveCookieStore(Map<String, List<Cookie>> cookieStore) {
        String json = gson.toJson(cookieStore);
        PreferencesManager.getInstance(HobbyTrackerApp.getContext())
                .getSharedPreferences().edit().putString(COOKIES_KEY, json).apply();
    }

    @Override
    public synchronized void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
        Map<String, List<Cookie>> cookieStore = getCookieStore();
        String host = url.host();
        List<Cookie> existing = cookieStore.getOrDefault(host, new ArrayList<>());

        for (Cookie newCookie : cookies) {
            assert existing != null;
            removeCookie(existing, newCookie);
            if (!isExpired(newCookie)) {
                existing.add(newCookie);
            }
        }

        cookieStore.put(host, existing);
        saveCookieStore(cookieStore);
    }

    @NonNull
    @Override
    public synchronized List<Cookie> loadForRequest(HttpUrl url) {
        Map<String, List<Cookie>> cookieStore = getCookieStore();
        String host = url.host();
        List<Cookie> cookies = cookieStore.getOrDefault(host, new ArrayList<>());
        List<Cookie> validCookies = new ArrayList<>();

        assert cookies != null;
        Iterator<Cookie> iterator = cookies.iterator();
        while (iterator.hasNext()) {
            Cookie cookie = iterator.next();
            if (isExpired(cookie)) {
                iterator.remove();
                continue;
            }

            if (cookie.matches(url)) {
                validCookies.add(cookie);
            }
        }

        return validCookies;
    }

    private void removeCookie(List<Cookie> cookies, Cookie target) {
        cookies.removeIf(current -> current.name().equals(target.name()) && current.path().equals(target.path()));
    }

    private boolean isExpired(Cookie cookie) {
        return cookie.expiresAt() < System.currentTimeMillis();
    }
}
