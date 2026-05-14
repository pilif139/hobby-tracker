# AuthenticationApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAuthMe**](AuthenticationApi.md#getAuthMe) | **GET** /auth/me |  |
| [**postAuthLogin**](AuthenticationApi.md#postAuthLogin) | **POST** /auth/login |  |
| [**postAuthLogout**](AuthenticationApi.md#postAuthLogout) | **POST** /auth/logout |  |
| [**postAuthLogoutOtherDevices**](AuthenticationApi.md#postAuthLogoutOtherDevices) | **POST** /auth/logout-other-devices |  |
| [**postAuthRegister**](AuthenticationApi.md#postAuthRegister) | **POST** /auth/register |  |


<a id="getAuthMe"></a>
# **getAuthMe**
> PostAuthLogin200Response getAuthMe()



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.AuthenticationApi;

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

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    try {
      PostAuthLogin200Response result = apiInstance.getAuthMe();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#getAuthMe");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PostAuthLogin200Response**](PostAuthLogin200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Current authenticated user |  -  |
| **404** | Not Found |  -  |

<a id="postAuthLogin"></a>
# **postAuthLogin**
> PostAuthLogin200Response postAuthLogin(postAuthLoginRequest)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.AuthenticationApi;

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

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    PostAuthLoginRequest postAuthLoginRequest = new PostAuthLoginRequest(); // PostAuthLoginRequest | 
    try {
      PostAuthLogin200Response result = apiInstance.postAuthLogin(postAuthLoginRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#postAuthLogin");
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
| **postAuthLoginRequest** | [**PostAuthLoginRequest**](PostAuthLoginRequest.md)|  | |

### Return type

[**PostAuthLogin200Response**](PostAuthLogin200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully logged in |  * Set-Cookie -  <br>  |
| **401** | Unauthorized |  -  |

<a id="postAuthLogout"></a>
# **postAuthLogout**
> PostAuthLogout200Response postAuthLogout()



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.AuthenticationApi;

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

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    try {
      PostAuthLogout200Response result = apiInstance.postAuthLogout();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#postAuthLogout");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

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
| **200** | Success |  -  |

<a id="postAuthLogoutOtherDevices"></a>
# **postAuthLogoutOtherDevices**
> PostAuthLogoutOtherDevices200Response postAuthLogoutOtherDevices()



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.AuthenticationApi;

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

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    try {
      PostAuthLogoutOtherDevices200Response result = apiInstance.postAuthLogoutOtherDevices();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#postAuthLogoutOtherDevices");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PostAuthLogoutOtherDevices200Response**](PostAuthLogoutOtherDevices200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Success |  -  |
| **400** | Bad Request |  -  |

<a id="postAuthRegister"></a>
# **postAuthRegister**
> PostAuthLogin200Response postAuthRegister(postAuthRegisterRequest)



### Example
```java
// Import classes:
import com.filip.hobbytracker.api.invoker.ApiClient;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.filip.hobbytracker.api.invoker.Configuration;
import com.filip.hobbytracker.api.invoker.auth.*;
import com.filip.hobbytracker.api.invoker.models.*;
import com.filip.hobbytracker.api.generated.api.AuthenticationApi;

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

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    PostAuthRegisterRequest postAuthRegisterRequest = new PostAuthRegisterRequest(); // PostAuthRegisterRequest | 
    try {
      PostAuthLogin200Response result = apiInstance.postAuthRegister(postAuthRegisterRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#postAuthRegister");
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
| **postAuthRegisterRequest** | [**PostAuthRegisterRequest**](PostAuthRegisterRequest.md)|  | |

### Return type

[**PostAuthLogin200Response**](PostAuthLogin200Response.md)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully registered user |  * Set-Cookie -  <br>  |
| **403** | Forbidden |  -  |
| **500** | Internal Server Error |  -  |

