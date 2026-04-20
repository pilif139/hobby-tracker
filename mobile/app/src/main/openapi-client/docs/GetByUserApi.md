# GetByUserApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getHobbySessionUserByUserId**](GetByUserApi.md#getHobbySessionUserByUserId) | **GET** /hobby-session/user/{userId} |  |
| [**getHobbyUserByUserId**](GetByUserApi.md#getHobbyUserByUserId) | **GET** /hobby/user/{userId} |  |


<a id="getHobbySessionUserByUserId"></a>
# **getHobbySessionUserByUserId**
> GetHobbySessionUserByUserId200Response getHobbySessionUserByUserId(userId, limit, offset, from, to)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.GetByUserApi;

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

    GetByUserApi apiInstance = new GetByUserApi(defaultClient);
    String userId = "userId_example"; // String | 
    Integer limit = 56; // Integer | 
    Integer offset = 56; // Integer | 
    String from = "from_example"; // String | 
    String to = "to_example"; // String | 
    try {
      GetHobbySessionUserByUserId200Response result = apiInstance.getHobbySessionUserByUserId(userId, limit, offset, from, to);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GetByUserApi#getHobbySessionUserByUserId");
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
| **userId** | **String**|  | |
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
| **200** | User Hobby Sessions with stats |  -  |
| **403** | Forbidden |  -  |

<a id="getHobbyUserByUserId"></a>
# **getHobbyUserByUserId**
> List&lt;GetHobbyUserByUserId200ResponseInner&gt; getHobbyUserByUserId(userId)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.GetByUserApi;

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

    GetByUserApi apiInstance = new GetByUserApi(defaultClient);
    String userId = "userId_example"; // String | 
    try {
      List<GetHobbyUserByUserId200ResponseInner> result = apiInstance.getHobbyUserByUserId(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GetByUserApi#getHobbyUserByUserId");
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
| **userId** | **String**|  | |

### Return type

[**List&lt;GetHobbyUserByUserId200ResponseInner&gt;**](GetHobbyUserByUserId200ResponseInner.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User Hobbies |  -  |

