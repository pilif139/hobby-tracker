# HobbyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteHobbyRemoveFromProfileByHobbyId**](HobbyApi.md#deleteHobbyRemoveFromProfileByHobbyId) | **DELETE** /hobby/remove-from-profile/{hobbyId} |  |
| [**getHobby**](HobbyApi.md#getHobby) | **GET** /hobby |  |
| [**getHobbyById**](HobbyApi.md#getHobbyById) | **GET** /hobby/{id} |  |
| [**getHobbyUserByUserId**](HobbyApi.md#getHobbyUserByUserId) | **GET** /hobby/user/{userId} |  |
| [**postHobby**](HobbyApi.md#postHobby) | **POST** /hobby |  |
| [**postHobbyAddToProfileByHobbyId**](HobbyApi.md#postHobbyAddToProfileByHobbyId) | **POST** /hobby/add-to-profile/{hobbyId} |  |


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
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    String hobbyId = "hobbyId_example"; // String | 
    try {
      PostAuthLogout200Response result = apiInstance.deleteHobbyRemoveFromProfileByHobbyId(hobbyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#deleteHobbyRemoveFromProfileByHobbyId");
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

<a id="getHobby"></a>
# **getHobby**
> List&lt;Object&gt; getHobby(search, offset, limit)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    String search = "search_example"; // String | 
    BigDecimal offset = new BigDecimal(78); // BigDecimal | 
    BigDecimal limit = new BigDecimal(78); // BigDecimal | 
    try {
      List<Object> result = apiInstance.getHobby(search, offset, limit);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#getHobby");
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
| **search** | **String**|  | [optional] |
| **offset** | **BigDecimal**|  | [optional] |
| **limit** | **BigDecimal**|  | [optional] |

### Return type

**List&lt;Object&gt;**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Search Results |  -  |

<a id="getHobbyById"></a>
# **getHobbyById**
> Object getHobbyById(id)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      Object result = apiInstance.getHobbyById(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#getHobbyById");
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
| **id** | **String**|  | |

### Return type

**Object**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Hobby |  -  |
| **404** | Not Found |  -  |

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
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    String userId = "userId_example"; // String | 
    try {
      List<GetHobbyUserByUserId200ResponseInner> result = apiInstance.getHobbyUserByUserId(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#getHobbyUserByUserId");
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

<a id="postHobby"></a>
# **postHobby**
> Object postHobby(postHobbyRequest)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    PostHobbyRequest postHobbyRequest = new PostHobbyRequest(); // PostHobbyRequest | 
    try {
      Object result = apiInstance.postHobby(postHobbyRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#postHobby");
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
| **postHobbyRequest** | [**PostHobbyRequest**](PostHobbyRequest.md)|  | |

### Return type

**Object**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created Hobby |  -  |

<a id="postHobbyAddToProfileByHobbyId"></a>
# **postHobbyAddToProfileByHobbyId**
> PostAuthLogout200Response postHobbyAddToProfileByHobbyId(hobbyId)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbyApi;

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

    HobbyApi apiInstance = new HobbyApi(defaultClient);
    String hobbyId = "hobbyId_example"; // String | 
    try {
      PostAuthLogout200Response result = apiInstance.postHobbyAddToProfileByHobbyId(hobbyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbyApi#postHobbyAddToProfileByHobbyId");
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
| **200** | Added |  -  |
| **404** | Not Found |  -  |
| **409** | Conflict |  -  |

