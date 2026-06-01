package com.filip.hobbytracker.repository.datasource;

import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseSessionsInner;
import com.filip.hobbytracker.data.local.HobbySessionEntity;

import java.util.List;

public interface HobbySessionLocalDataSource {
    List<HobbySessionEntity> getSessions(String hobbyId);
    List<HobbySessionEntity> getAllSessions();
    List<HobbySessionEntity> getUserSessions(String userId, int limit, int offset);
    void saveSessions(List<GetHobbySessionUserByUserId200ResponseSessionsInner> sessions);
    void saveFeedSessions(List<GetFeed200ResponseSessionsInner> sessions);
    void deleteSessionsNotInRemoteIds(List<String> remoteIds);
    long saveSession(HobbySessionEntity entity);
    void updateSession(HobbySessionEntity entity);
}
