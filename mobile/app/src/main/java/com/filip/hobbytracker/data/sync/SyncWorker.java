package com.filip.hobbytracker.data.sync;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionById200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseSessionsInner;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.data.local.AppDatabase;
import com.filip.hobbytracker.data.local.HobbySessionDao;
import com.filip.hobbytracker.data.local.HobbySessionEntity;
import com.filip.hobbytracker.data.local.UserEntity;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SyncWorker extends Worker {

    private final AppDatabase db;
    private final HobbySessionDao dao;
    private final Gson gson = new Gson();

    public SyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        db = AppDatabase.getDatabase(context);
        dao = db.hobbySessionDao();
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.d("SyncWorker", "Starting synchronization...");

        try {
            ApiProvider.authenticationApi().getAuthMe();

            pushPendingChanges();

            reconcileWithBackend();

            Log.d("SyncWorker", "Synchronization completed successfully.");
            return Result.success();
        } catch (ApiException e) {
            Log.e("SyncWorker", "API Error during sync", e);
            if (e.getCode() == 401) {
                clearLocalSession();
                return Result.failure();
            }
            return Result.retry();
        } catch (Exception e) {
            Log.e("SyncWorker", "Unexpected error during sync", e);
            return Result.retry();
        }
    }

    private void pushPendingChanges() throws ApiException {
        List<HobbySessionEntity> pending = dao.getPendingSessions();
        for (HobbySessionEntity session : pending) {
            if ("PENDING_CREATE".equals(session.syncStatus)) {
                List<Object> images = gson.fromJson(session.imageUrlsJson, new TypeToken<List<Object>>(){}.getType());
                GetHobbySessionById200Response response = ApiProvider.hobbySessionApi().postHobbySession(
                        session.hobbyId, session.startTime, session.endTime, session.notes, images);
                
                session.remoteId = response.getId();
                session.syncStatus = "SYNCED";
                session.updatedAt = response.getUpdatedAt();
                dao.update(session);
            }
        }
    }

    private void reconcileWithBackend() throws ApiException {
        UserEntity user = db.userDao().getUser();
        if (user == null) return;

        Set<String> remoteIds = new HashSet<>();
        int limit = 100;
        int offset = 0;
        boolean hasMore = true;

        while (hasMore) {
            GetHobbySessionUserByUserId200Response response = ApiProvider.hobbySessionApi()
                    .getHobbySessionUserByUserId(String.valueOf(user.id), limit, offset, null, null);

            List<GetHobbySessionUserByUserId200ResponseSessionsInner> remoteSessions = response.getSessions();
            if (remoteSessions.isEmpty()) {
                hasMore = false;
                continue;
            }

            for (GetHobbySessionUserByUserId200ResponseSessionsInner remote : remoteSessions) {
                if (remote.getId() == null) continue;
                
                remoteIds.add(remote.getId());
                HobbySessionEntity local = dao.getByRemoteId(remote.getId());

                if (local == null) {
                    HobbySessionEntity entity = new HobbySessionEntity();
                    entity.remoteId = remote.getId();
                    entity.hobbyId = remote.getHobbyId();
                    entity.userId = remote.getUserId();
                    entity.startTime = remote.getStartTime();
                    entity.endTime = remote.getEndTime();
                    entity.notes = remote.getNotes();
                    entity.imageUrlsJson = gson.toJson(remote.getImageUrls());
                    entity.syncStatus = "SYNCED";
                    entity.createdAt = remote.getCreatedAt();
                    entity.updatedAt = remote.getUpdatedAt();
                    dao.insert(entity);
                } else if ("SYNCED".equals(local.syncStatus)) {
                    local.hobbyId = remote.getHobbyId();
                    local.startTime = remote.getStartTime();
                    local.endTime = remote.getEndTime();
                    local.notes = remote.getNotes();
                    local.imageUrlsJson = gson.toJson(remote.getImageUrls());
                    local.updatedAt = remote.getUpdatedAt();
                    dao.update(local);
                }
            }

            if (remoteSessions.size() < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        List<HobbySessionEntity> allLocal = dao.getAllSessions();
        for (HobbySessionEntity local : allLocal) {
            if (local.remoteId != null && !remoteIds.contains(local.remoteId) && "SYNCED".equals(local.syncStatus)) {
                dao.delete(local);
            }
        }
    }

    private void clearLocalSession() {
        db.userDao().clearUser();
    }
}