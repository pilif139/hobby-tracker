package com.filip.hobbytracker.repository.datasource;

import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;
import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInnerHobby;
import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInnerUser;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200ResponseSessionsInner;
import com.filip.hobbytracker.data.local.HobbySessionEntity;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;
import java.util.List;

public class HobbySessionMapper {

    private HobbySessionMapper() {}

    public static GetHobbySessionUserByUserId200ResponseSessionsInner toSessionModel(HobbySessionEntity entity, Gson gson) {
        GetHobbySessionUserByUserId200ResponseSessionsInner session = new GetHobbySessionUserByUserId200ResponseSessionsInner();
        session.setId(entity.remoteId);
        session.setHobbyId(entity.hobbyId);
        session.setUserId(entity.userId);
        session.setStartTime(entity.startTime);
        session.setEndTime(entity.endTime);
        session.setNotes(entity.notes);
        session.setImageUrls(parseImageUrls(entity.imageUrlsJson, gson));
        session.setCreatedAt(entity.createdAt);
        session.setUpdatedAt(entity.updatedAt);
        return session;
    }

    public static GetFeed200ResponseSessionsInner toFeedItem(HobbySessionEntity entity, Gson gson) {
        GetFeed200ResponseSessionsInner item = new GetFeed200ResponseSessionsInner();
        item.setId(entity.remoteId);
        item.setStartTime(entity.startTime);
        item.setEndTime(entity.endTime);
        item.setNotes(entity.notes);
        item.setCreatedAt(entity.createdAt);
        item.setImageUrls(parseImageUrls(entity.imageUrlsJson, gson));

        GetFeed200ResponseSessionsInnerUser user = new GetFeed200ResponseSessionsInnerUser();
        user.setName(entity.userId != null ? entity.userId : "");
        item.setUser(user);

        GetFeed200ResponseSessionsInnerHobby hobby = new GetFeed200ResponseSessionsInnerHobby();
        hobby.setName(entity.hobbyId != null ? entity.hobbyId : "");
        item.setHobby(hobby);

        return item;
    }

    public static HobbySessionEntity fromFeedItem(GetFeed200ResponseSessionsInner item, Gson gson) {
        HobbySessionEntity entity = new HobbySessionEntity();
        entity.remoteId = item.getId();
        entity.userId = item.getUser() != null ? item.getUser().getId() : null;
        entity.hobbyId = item.getHobby() != null ? item.getHobby().getId() : null;
        entity.startTime = item.getStartTime();
        entity.endTime = item.getEndTime();
        entity.notes = item.getNotes();
        entity.imageUrlsJson = gson.toJson(item.getImageUrls());
        entity.syncStatus = "SYNCED";
        entity.createdAt = item.getCreatedAt();
        return entity;
    }

    private static List<String> parseImageUrls(String json, Gson gson) {
        if (json == null) return new ArrayList<>();
        List<String> urls = gson.fromJson(json, new TypeToken<List<String>>(){}.getType());
        return urls != null ? urls : new ArrayList<>();
    }
}
