# FeedApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getFeed**](FeedApi.md#getFeed) | **GET** /feed |  |
| [**getFeedFollowSuggestionsHobby**](FeedApi.md#getFeedFollowSuggestionsHobby) | **GET** /feed/follow-suggestions/hobby |  |
| [**getFeedFollowSuggestionsSocial**](FeedApi.md#getFeedFollowSuggestionsSocial) | **GET** /feed/follow-suggestions/social |  |
| [**getFeedHobbySuggestions**](FeedApi.md#getFeedHobbySuggestions) | **GET** /feed/hobby-suggestions |  |


<a id="getFeed"></a>
# **getFeed**
> GetFeed200Response getFeed(limit, cursor)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.FeedApi;

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

    FeedApi apiInstance = new FeedApi(defaultClient);
    Integer limit = 56; // Integer | 
    String cursor = "cursor_example"; // String | 
    try {
      GetFeed200Response result = apiInstance.getFeed(limit, cursor);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling FeedApi#getFeed");
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
| **limit** | **Integer**|  | [optional] |
| **cursor** | **String**|  | [optional] |

### Return type

[**GetFeed200Response**](GetFeed200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated feed of followed users sessions |  -  |

<a id="getFeedFollowSuggestionsHobby"></a>
# **getFeedFollowSuggestionsHobby**
> GetFeedFollowSuggestionsHobby200Response getFeedFollowSuggestionsHobby(limit)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.FeedApi;

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

    FeedApi apiInstance = new FeedApi(defaultClient);
    Integer limit = 56; // Integer | 
    try {
      GetFeedFollowSuggestionsHobby200Response result = apiInstance.getFeedFollowSuggestionsHobby(limit);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling FeedApi#getFeedFollowSuggestionsHobby");
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
| **limit** | **Integer**|  | [optional] |

### Return type

[**GetFeedFollowSuggestionsHobby200Response**](GetFeedFollowSuggestionsHobby200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Users who share your hobbies |  -  |

<a id="getFeedFollowSuggestionsSocial"></a>
# **getFeedFollowSuggestionsSocial**
> GetFeedFollowSuggestionsSocial200Response getFeedFollowSuggestionsSocial(limit)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.FeedApi;

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

    FeedApi apiInstance = new FeedApi(defaultClient);
    Integer limit = 56; // Integer | 
    try {
      GetFeedFollowSuggestionsSocial200Response result = apiInstance.getFeedFollowSuggestionsSocial(limit);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling FeedApi#getFeedFollowSuggestionsSocial");
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
| **limit** | **Integer**|  | [optional] |

### Return type

[**GetFeedFollowSuggestionsSocial200Response**](GetFeedFollowSuggestionsSocial200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Users followed by people you follow |  -  |

<a id="getFeedHobbySuggestions"></a>
# **getFeedHobbySuggestions**
> GetFeedHobbySuggestions200Response getFeedHobbySuggestions(limit, period)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.FeedApi;

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

    FeedApi apiInstance = new FeedApi(defaultClient);
    Integer limit = 56; // Integer | 
    String period = "week"; // String | 
    try {
      GetFeedHobbySuggestions200Response result = apiInstance.getFeedHobbySuggestions(limit, period);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling FeedApi#getFeedHobbySuggestions");
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
| **limit** | **Integer**|  | [optional] |
| **period** | **String**|  | [optional] [enum: week, month] |

### Return type

[**GetFeedHobbySuggestions200Response**](GetFeedHobbySuggestions200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Trending hobbies you have not joined |  -  |

