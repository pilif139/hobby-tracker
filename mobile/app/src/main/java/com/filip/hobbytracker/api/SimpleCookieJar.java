package com.filip.hobbytracker.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;

/**
 * In-memory cookie jar for demo use.
 *
 * <p>
 * For production apps, persist cookies in encrypted storage.
 * </p>
 */
public class SimpleCookieJar implements CookieJar {

    private final Map<String, List<Cookie>> cookieStore = new HashMap<>();

    @Override
    public synchronized void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
        String host = url.host();
        List<Cookie> existing = cookieStore.getOrDefault(host, new ArrayList<>());

        for (Cookie newCookie : cookies) {
            removeCookie(existing, newCookie);
            if (!isExpired(newCookie)) {
                existing.add(newCookie);
            }
        }

        cookieStore.put(host, existing);
    }

    @Override
    public synchronized List<Cookie> loadForRequest(HttpUrl url) {
        String host = url.host();
        List<Cookie> cookies = cookieStore.getOrDefault(host, new ArrayList<>());
        List<Cookie> validCookies = new ArrayList<>();

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
