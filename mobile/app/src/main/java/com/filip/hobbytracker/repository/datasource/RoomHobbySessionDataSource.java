package com.filip.hobbytracker.repository.datasource;

import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseSessionsInner;
import com.filip.hobbytracker.data.local.AppDatabase;
import com.filip.hobbytracker.data.local.HobbySessionEntity;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

public class RoomHobbySessionDataSource implements HobbySessionLocalDataSource {

    private final AppDatabase db;
    private final Gson gson = new Gson();

    public RoomHobbySessionDataSource(AppDatabase db) {
        this.db = db;
    }

    @Override
    public List<HobbySessionEntity> getSessions(String hobbyId) {
        List<HobbySessionEntity> all = db.hobbySessionDao().getAllSessions();
        List<HobbySessionEntity> filtered = new ArrayList<>();
        for (HobbySessionEntity entity : all) {
            if (hobbyId.equals(entity.hobbyId)) {
                filtered.add(entity);
            }
        }
        return filtered;
    }

    @Override
    public List<HobbySessionEntity> getAllSessions() {
        return db.hobbySessionDao().getAllSessions();
    }

    @Override
    public List<HobbySessionEntity> getUserSessions(String userId, int limit, int offset) {
        return db.hobbySessionDao().getUserSessions(userId, limit, offset);
    }

    @Override
    public void saveSessions(List<GetHobbySessionUserByUserId200ResponseSessionsInner> sessions) {
        for (GetHobbySessionUserByUserId200ResponseSessionsInner session : sessions) {
            HobbySessionEntity entity = new HobbySessionEntity();
            entity.remoteId = session.getId();
            entity.hobbyId = session.getHobbyId();
            entity.userId = session.getUserId();
            entity.startTime = session.getStartTime();
            entity.endTime = session.getEndTime();
            entity.notes = session.getNotes();
            entity.imageUrlsJson = gson.toJson(session.getImageUrls());
            entity.syncStatus = "SYNCED";
            entity.createdAt = session.getCreatedAt();
            entity.updatedAt = session.getUpdatedAt();
            db.hobbySessionDao().insert(entity);
        }
    }

    @Override
    public void saveFeedSessions(List<GetFeed200ResponseSessionsInner> sessions) {
        for (GetFeed200ResponseSessionsInner session : sessions) {
            HobbySessionEntity entity = HobbySessionMapper.fromFeedItem(session, gson);
            db.hobbySessionDao().insert(entity);
        }
    }

    @Override
    public void deleteSessionsNotInRemoteIds(List<String> remoteIds) {
        db.hobbySessionDao().deleteSessionsNotInRemoteIds(remoteIds);
    }

    @Override
    public long saveSession(HobbySessionEntity entity) {
        return db.hobbySessionDao().insert(entity);
    }

    @Override
    public void updateSession(HobbySessionEntity entity) {
        db.hobbySessionDao().update(entity);
    }
}
