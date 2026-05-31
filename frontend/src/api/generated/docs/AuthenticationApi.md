# AuthenticationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAuthMe**](#getauthme) | **GET** /auth/me | |
|[**postAuthLogin**](#postauthlogin) | **POST** /auth/login | |
|[**postAuthLogout**](#postauthlogout) | **POST** /auth/logout | |
|[**postAuthLogoutOtherDevices**](#postauthlogoutotherdevices) | **POST** /auth/logout-other-devices | |
|[**postAuthRegister**](#postauthregister) | **POST** /auth/register | |

# **getAuthMe**
> PostAuthLogin200Response getAuthMe()


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.getAuthMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PostAuthLogin200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Current authenticated user |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAuthLogin**
> PostAuthLogin200Response postAuthLogin(postAuthLoginRequest)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    PostAuthLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let postAuthLoginRequest: PostAuthLoginRequest; //

const { status, data } = await apiInstance.postAuthLogin(
    postAuthLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postAuthLoginRequest** | **PostAuthLoginRequest**|  | |


### Return type

**PostAuthLogin200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully logged in |  * Set-Cookie -  <br>  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAuthLogout**
> PostAuthLogout200Response postAuthLogout()


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.postAuthLogout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PostAuthLogout200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAuthLogoutOtherDevices**
> PostAuthLogout200Response postAuthLogoutOtherDevices()


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.postAuthLogoutOtherDevices();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PostAuthLogout200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAuthRegister**
> PostAuthLogin200Response postAuthRegister(postAuthRegisterRequest)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    PostAuthRegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let postAuthRegisterRequest: PostAuthRegisterRequest; //

const { status, data } = await apiInstance.postAuthRegister(
    postAuthRegisterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postAuthRegisterRequest** | **PostAuthRegisterRequest**|  | |


### Return type

**PostAuthLogin200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully registered user |  * Set-Cookie -  <br>  |
|**403** | Forbidden |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

