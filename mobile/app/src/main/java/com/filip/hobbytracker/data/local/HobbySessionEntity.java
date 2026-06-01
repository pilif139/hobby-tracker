package com.filip.hobbytracker.data.local;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.Index;

@Entity(tableName = "hobby_sessions", indices = {@Index(value = {"remoteId"}, unique = true)})
public class HobbySessionEntity {
    @PrimaryKey(autoGenerate = true)
    public long localId;

    public String remoteId; // ID from backend
    public String hobbyId;
    public String userId;
    public String startTime;
    public String endTime;
    public String notes;
    public String imageUrlsJson; // Stored as JSON string
    
    public String syncStatus; // SYNCED, PENDING_CREATE, PENDING_UPDATE, PENDING_DELETE
    
    public String createdAt;
    public String updatedAt;

    public HobbySessionEntity() {}
}