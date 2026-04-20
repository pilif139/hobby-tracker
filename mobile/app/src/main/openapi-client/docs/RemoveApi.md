# RemoveApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteHobbyRemoveFromProfileByHobbyId**](RemoveApi.md#deleteHobbyRemoveFromProfileByHobbyId) | **DELETE** /hobby/remove-from-profile/{hobbyId} |  |


<a id="deleteHobbyRemoveFromProfileByHobbyId"></a>
# **deleteHobbyRemoveFromProfileByHobbyId**
> PostAuthLogout200Response deleteHobbyRemoveFromProfileByHobbyId(hobbyId)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.RemoveApi;

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

    RemoveApi apiInstance = new RemoveApi(defaultClient);
    String hobbyId = "hobbyId_example"; // String | 
    try {
      PostAuthLogout200Response result = apiInstance.deleteHobbyRemoveFromProfileByHobbyId(hobbyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling RemoveApi#deleteHobbyRemoveFromProfileByHobbyId");
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

### Return type

[**PostAuthLogout200Response**](PostAuthLogout200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Removed |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

