package com.filip.hobbytracker.lib;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferencesManager {

    private static PreferencesManager instance;
    private final SharedPreferences sharedPreferences;

    private static final String PREF_NAME = "hobby_tracker_prefs";

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

    public void clear() {
        sharedPreferences.edit().clear().apply();
    }
}