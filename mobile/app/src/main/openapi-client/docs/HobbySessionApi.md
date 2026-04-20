# HobbySessionApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteHobbySessionById**](HobbySessionApi.md#deleteHobbySessionById) | **DELETE** /hobby-session/{id} |  |
| [**getHobbySessionById**](HobbySessionApi.md#getHobbySessionById) | **GET** /hobby-session/{id} |  |
| [**getHobbySessionHobbyByHobbyId**](HobbySessionApi.md#getHobbySessionHobbyByHobbyId) | **GET** /hobby-session/hobby/{hobbyId} |  |
| [**getHobbySessionUserByUserId**](HobbySessionApi.md#getHobbySessionUserByUserId) | **GET** /hobby-session/user/{userId} |  |
| [**patchHobbySessionById**](HobbySessionApi.md#patchHobbySessionById) | **PATCH** /hobby-session/{id} |  |
| [**postHobbySession**](HobbySessionApi.md#postHobbySession) | **POST** /hobby-session |  |


<a id="deleteHobbySessionById"></a>
# **deleteHobbySessionById**
> deleteHobbySessionById(id)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      apiInstance.deleteHobbySessionById(id);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#deleteHobbySessionById");
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

null (empty response body)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

<a id="getHobbySessionById"></a>
# **getHobbySessionById**
> GetHobbySessionById200Response getHobbySessionById(id)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      GetHobbySessionById200Response result = apiInstance.getHobbySessionById(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#getHobbySessionById");
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

[**GetHobbySessionById200Response**](GetHobbySessionById200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Hobby Session |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

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
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    String hobbyId = "hobbyId_example"; // String | 
    Integer limit = 56; // Integer | 
    Integer offset = 56; // Integer | 
    String from = "from_example"; // String | 
    String to = "to_example"; // String | 
    try {
      GetHobbySessionUserByUserId200Response result = apiInstance.getHobbySessionHobbyByHobbyId(hobbyId, limit, offset, from, to);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#getHobbySessionHobbyByHobbyId");
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
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    String userId = "userId_example"; // String | 
    Integer limit = 56; // Integer | 
    Integer offset = 56; // Integer | 
    String from = "from_example"; // String | 
    String to = "to_example"; // String | 
    try {
      GetHobbySessionUserByUserId200Response result = apiInstance.getHobbySessionUserByUserId(userId, limit, offset, from, to);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#getHobbySessionUserByUserId");
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

<a id="patchHobbySessionById"></a>
# **patchHobbySessionById**
> GetHobbySessionById200Response patchHobbySessionById(id, patchHobbySessionByIdRequest)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    String id = "id_example"; // String | 
    PatchHobbySessionByIdRequest patchHobbySessionByIdRequest = new PatchHobbySessionByIdRequest(); // PatchHobbySessionByIdRequest | 
    try {
      GetHobbySessionById200Response result = apiInstance.patchHobbySessionById(id, patchHobbySessionByIdRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#patchHobbySessionById");
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
| **patchHobbySessionByIdRequest** | [**PatchHobbySessionByIdRequest**](PatchHobbySessionByIdRequest.md)|  | |

### Return type

[**GetHobbySessionById200Response**](GetHobbySessionById200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated session |  -  |
| **400** | Bad Request |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

<a id="postHobbySession"></a>
# **postHobbySession**
> GetHobbySessionById200Response postHobbySession(postHobbySessionRequest)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.HobbySessionApi;

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

    HobbySessionApi apiInstance = new HobbySessionApi(defaultClient);
    PostHobbySessionRequest postHobbySessionRequest = new PostHobbySessionRequest(); // PostHobbySessionRequest | 
    try {
      GetHobbySessionById200Response result = apiInstance.postHobbySession(postHobbySessionRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling HobbySessionApi#postHobbySession");
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
| **postHobbySessionRequest** | [**PostHobbySessionRequest**](PostHobbySessionRequest.md)|  | |

### Return type

[**GetHobbySessionById200Response**](GetHobbySessionById200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created session |  -  |
| **400** | Bad Request |  -  |

