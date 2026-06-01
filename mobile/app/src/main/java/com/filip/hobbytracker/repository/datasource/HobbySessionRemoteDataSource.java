package com.filip.hobbytracker.repository.datasource;

import com.filip.hobbytracker.api.generated.model.GetHobbySessionById200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;

import java.util.List;

public interface HobbySessionRemoteDataSource {
    GetHobbySessionUserByUserId200Response getSessions(String hobbyId) throws Exception;
    GetHobbySessionById200Response createSession(String hobbyId, String startTime, String endTime, String notes, List<Object> images) throws Exception;
}
