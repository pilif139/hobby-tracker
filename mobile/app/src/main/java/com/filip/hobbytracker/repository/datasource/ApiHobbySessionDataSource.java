package com.filip.hobbytracker.repository.datasource;

import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionById200Response;
import com.filip.hobbytracker.api.generated.model.GetHobbySessionUserByUserId200Response;

import java.util.List;

public class ApiHobbySessionDataSource implements HobbySessionRemoteDataSource {

    @Override
    public GetHobbySessionUserByUserId200Response getSessions(String hobbyId) throws Exception {
        return ApiProvider.hobbySessionApi().getHobbySessionHobbyByHobbyId(hobbyId, null, null, null, null);
    }

    @Override
    public GetHobbySessionById200Response createSession(String hobbyId, String startTime, String endTime, String notes, List<Object> images) throws Exception {
        return ApiProvider.hobbySessionApi().postHobbySession(hobbyId, startTime, endTime, notes, images);
    }
}
