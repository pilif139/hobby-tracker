package com.filip.hobbytracker.data.local;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

@Dao
public interface UserDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertUser(UserEntity user);

    @Query("SELECT * FROM user_cache LIMIT 1")
    UserEntity getUser();

    @Query("DELETE FROM user_cache")
    void clearUser();
}