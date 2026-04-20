# GetByHobbyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getHobbySessionHobbyByHobbyId**](GetByHobbyApi.md#getHobbySessionHobbyByHobbyId) | **GET** /hobby-session/hobby/{hobbyId} |  |


<a id="getHobbySessionHobbyByHobbyId"></a>
# **getHobbySessionHobbyByHobbyId**
> GetHobbySessionUserByUserId200Response getHobbySessionHobbyByHobbyId(hobbyId, limit, offset, from, to)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.GetByHobbyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: accessTokenCookie
    ApiKeyAuth accessTokenCookie = (ApiKeyAuth) defaultClient.getAuthentication("accessTokenCookie");
    accessTokenCookie.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //accessTokenCookie.setApiKeyPrefix("Token");

    // Configure API key authorization: refreshTokenCookie
    ApiKeyAuth refreshTokenCookie = (ApiKeyAuth) defaultClient.getAuthentication("refreshTokenCookie");
    refreshTokenCookie.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //refreshTokenCookie.setApiKeyPrefix("Token");

    GetByHobbyApi apiInstance = new GetByHobbyApi(defaultClient);
    String hobbyId = "hobbyId_example"; // String | 
    Integer limit = 56; // Integer | 
    Integer offset = 56; // Integer | 
    String from = "from_example"; // String | 
    String to = "to_example"; // String | 
    try {
      GetHobbySessionUserByUserId200Response result = apiInstance.getHobbySessionHobbyByHobbyId(hobbyId, limit, offset, from, to);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GetByHobbyApi#getHobbySessionHobbyByHobbyId");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **hobbyId** | **String**|  | |
| **limit** | **Integer**|  | [optional] |
| **offset** | **Integer**|  | [optional] |
| **from** | **String**|  | [optional] |
| **to** | **String**|  | [optional] |

### Return type

[**GetHobbySessionUserByUserId200Response**](GetHobbySessionUserByUserId200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Current user sessions for a hobby with stats |  -  |

