package com.filip.hobbytracker.lib;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferencesManager {

    private static PreferencesManager instance;
    private final SharedPreferences sharedPreferences;

    private static final String PREF_NAME = "hobby_tracker_prefs";

    private static final String KEY_DARK_MODE = "dark_mode_enabled";
    private static final String KEY_AVATAR_PATH = "avatar_path";

    private PreferencesManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static synchronized PreferencesManager getInstance(Context context) {
        if (instance == null) {
            instance = new PreferencesManager(context.getApplicationContext());
        }
        return instance;
    }

    public SharedPreferences getSharedPreferences() {
        return sharedPreferences;
    }

    public void setDarkMode(boolean enabled) {
        sharedPreferences.edit().putBoolean(KEY_DARK_MODE, enabled).apply();
    }

    public boolean isDarkMode() {
        return sharedPreferences.getBoolean(KEY_DARK_MODE, false);
    }

    public void setAvatarPath(String path) {
        sharedPreferences.edit().putString(KEY_AVATAR_PATH, path).apply();
    }

    public String getAvatarPath() {
        return sharedPreferences.getString(KEY_AVATAR_PATH, null);
    }

    public void clear() {
        sharedPreferences.edit().clear().apply();
    }
}
