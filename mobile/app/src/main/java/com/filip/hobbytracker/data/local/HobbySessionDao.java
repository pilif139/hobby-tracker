package com.filip.hobbytracker.data.local;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import androidx.room.Delete;

import java.util.List;

@Dao
public interface HobbySessionDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insert(HobbySessionEntity session);

    @Update
    void update(HobbySessionEntity session);

    @Delete
    void delete(HobbySessionEntity session);

    @Query("SELECT * FROM hobby_sessions ORDER BY startTime DESC")
    List<HobbySessionEntity> getAllSessions();

    @Query("SELECT * FROM hobby_sessions WHERE userId = :userId ORDER BY startTime DESC LIMIT :limit OFFSET :offset")
    List<HobbySessionEntity> getUserSessions(String userId, int limit, int offset);

    @Query("SELECT * FROM hobby_sessions WHERE syncStatus != 'SYNCED'")
    List<HobbySessionEntity> getPendingSessions();

    @Query("SELECT * FROM hobby_sessions WHERE remoteId = :remoteId")
    HobbySessionEntity getByRemoteId(String remoteId);

    @Query("DELETE FROM hobby_sessions WHERE remoteId = :remoteId")
    void deleteByRemoteId(String remoteId);

    @Query("DELETE FROM hobby_sessions WHERE remoteId NOT IN (:remoteIds) AND syncStatus = 'SYNCED'")
    void deleteSessionsNotInRemoteIds(List<String> remoteIds);
}
