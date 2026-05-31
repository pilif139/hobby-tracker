package com.filip.hobbytracker.repository;

import android.content.Context;
import com.filip.hobbytracker.R;
import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionById200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseSessionsInner;
import com.filip.hobbytracker.data.local.AppDatabase;
import com.filip.hobbytracker.data.local.HobbySessionEntity;
import com.filip.hobbytracker.data.local.UserEntity;
import com.filip.hobbytracker.lib.NetworkUtils;
import com.filip.hobbytracker.repository.datasource.ApiHobbySessionDataSource;
import com.filip.hobbytracker.repository.datasource.HobbySessionLocalDataSource;
import com.filip.hobbytracker.repository.datasource.HobbySessionMapper;
import com.filip.hobbytracker.repository.datasource.HobbySessionRemoteDataSource;
import com.filip.hobbytracker.repository.datasource.RoomHobbySessionDataSource;
import com.google.gson.Gson;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;

public class HobbySessionRepository extends BaseRepository {

    private final HobbySessionRemoteDataSource remote;
    private final HobbySessionLocalDataSource local;
    private final AppDatabase db;
    private final Gson gson = new Gson();

    public HobbySessionRepository(Context context, ExecutorService executor) {
        super(context, executor);
        this.db = AppDatabase.getDatabase(context);
        this.remote = new ApiHobbySessionDataSource();
        this.local = new RoomHobbySessionDataSource(db);
    }

    public HobbySessionRepository(Context context, ExecutorService executor,
                                   HobbySessionRemoteDataSource remote,
                                   HobbySessionLocalDataSource local,
                                   AppDatabase db) {
        super(context, executor);
        this.remote = remote;
        this.local = local;
        this.db = db;
    }

    public void getSessionsByHobby(String hobbyId, Callback<GetHobbySessionUserByUserId200Response> callback) {
        if (NetworkUtils.isNetworkAvailable(context)) {
            executeRequest(() -> {
                GetHobbySessionUserByUserId200Response response = remote.getSessions(hobbyId);
                executor.execute(() -> local.saveSessions(response.getSessions()));
                return response;
            }, callback, R.string.error_network);
        } else {
            executor.execute(() -> {
                List<HobbySessionEntity> cached = local.getSessions(hobbyId);
                List<GetHobbySessionUserByUserId200ResponseSessionsInner> sessions = new ArrayList<>();
                for (HobbySessionEntity entity : cached) {
                    sessions.add(HobbySessionMapper.toSessionModel(entity, gson));
                }
                GetHobbySessionUserByUserId200Response response = new GetHobbySessionUserByUserId200Response();
                response.setSessions(sessions);
                callback.onResult(Resource.success(response));
            });
        }
    }

    public void getUserFeedSessions(int limit, int offset, Callback<List<GetFeed200ResponseSessionsInner>> callback) {
        executor.execute(() -> {
            UserEntity currentUser = db.userDao().getUser();
            if (currentUser == null) {
                callback.onResult(Resource.error(context.getString(R.string.error_network), null));
                return;
            }
            String userId = currentUser.id.toString();
            List<HobbySessionEntity> entities = local.getUserSessions(userId, limit, offset);
            List<GetFeed200ResponseSessionsInner> feedItems = new ArrayList<>();
            for (HobbySessionEntity entity : entities) {
                feedItems.add(HobbySessionMapper.toFeedItem(entity, gson));
            }
            callback.onResult(Resource.success(feedItems));
        });
    }

    public void createSession(String hobbyId, String startTime, String endTime, String notes, List<Object> images, Callback<GetHobbySessionById200Response> callback) {
        HobbySessionEntity localEntity = new HobbySessionEntity();
        localEntity.hobbyId = hobbyId;
        localEntity.startTime = startTime;
        localEntity.endTime = endTime;
        localEntity.notes = notes;
        localEntity.imageUrlsJson = gson.toJson(images);
        localEntity.syncStatus = "PENDING_CREATE";
        localEntity.createdAt = Instant.now().toString();
        localEntity.updatedAt = Instant.now().toString();

        if (NetworkUtils.isNetworkAvailable(context)) {
            executeRequest(() -> {
                GetHobbySessionById200Response response = remote.createSession(hobbyId, startTime, endTime, notes, images);
                localEntity.remoteId = response.getId();
                localEntity.syncStatus = "SYNCED";
                localEntity.createdAt = response.getCreatedAt();
                localEntity.updatedAt = response.getUpdatedAt();
                local.saveSession(localEntity);
                return response;
            }, callback, R.string.error_network);
        } else {
            executor.execute(() -> {
                local.saveSession(localEntity);
                GetHobbySessionById200Response mockResponse = new GetHobbySessionById200Response();
                mockResponse.setHobbyId(hobbyId);
                mockResponse.setStartTime(startTime);
                mockResponse.setEndTime(endTime);
                mockResponse.setNotes(notes);
                callback.onResult(Resource.success(mockResponse));
            });
        }
    }
}
