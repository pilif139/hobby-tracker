package com.filip.hobbytracker;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;

public class HobbyTrackerApp extends Application {

    private static HobbyTrackerApp instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
    }

    public static Context getContext() {
        return instance.getApplicationContext();
    }
}