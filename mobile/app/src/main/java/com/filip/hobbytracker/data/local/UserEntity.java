package com.filip.hobbytracker.data.local;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.util.UUID;

@Entity(tableName = "user_cache")
public class UserEntity {
    @PrimaryKey
    @androidx.annotation.NonNull
    public UUID id;
    public String name;
    public String email;

    public UserEntity(@NonNull UUID id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}