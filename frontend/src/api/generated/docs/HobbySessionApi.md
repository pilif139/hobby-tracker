# HobbySessionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteHobbySessionById**](#deletehobbysessionbyid) | **DELETE** /hobby-session/{id} | |
|[**getHobbySessionById**](#gethobbysessionbyid) | **GET** /hobby-session/{id} | |
|[**getHobbySessionHobbyByHobbyId**](#gethobbysessionhobbybyhobbyid) | **GET** /hobby-session/hobby/{hobbyId} | |
|[**getHobbySessionUserByUserId**](#gethobbysessionuserbyuserid) | **GET** /hobby-session/user/{userId} | |
|[**patchHobbySessionById**](#patchhobbysessionbyid) | **PATCH** /hobby-session/{id} | |
|[**postHobbySession**](#posthobbysession) | **POST** /hobby-session | |

# **deleteHobbySessionById**
> deleteHobbySessionById()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteHobbySessionById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobbySessionById**
> GetHobbySessionById200Response getHobbySessionById()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getHobbySessionById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GetHobbySessionById200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hobby Session |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobbySessionHobbyByHobbyId**
> GetHobbySessionUserByUserId200Response getHobbySessionHobbyByHobbyId()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let hobbyId: string; // (default to undefined)
let limit: number; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)
let from: string; // (optional) (default to undefined)
let to: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getHobbySessionHobbyByHobbyId(
    hobbyId,
    limit,
    offset,
    from,
    to
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hobbyId** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **offset** | [**number**] |  | (optional) defaults to undefined|
| **from** | [**string**] |  | (optional) defaults to undefined|
| **to** | [**string**] |  | (optional) defaults to undefined|


### Return type

**GetHobbySessionUserByUserId200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Current user sessions for a hobby with stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobbySessionUserByUserId**
> GetHobbySessionUserByUserId200Response getHobbySessionUserByUserId()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let userId: string; // (default to undefined)
let limit: number; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)
let from: string; // (optional) (default to undefined)
let to: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getHobbySessionUserByUserId(
    userId,
    limit,
    offset,
    from,
    to
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **offset** | [**number**] |  | (optional) defaults to undefined|
| **from** | [**string**] |  | (optional) defaults to undefined|
| **to** | [**string**] |  | (optional) defaults to undefined|


### Return type

**GetHobbySessionUserByUserId200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User Hobby Sessions with stats |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **patchHobbySessionById**
> GetHobbySessionById200Response patchHobbySessionById()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let id: string; // (default to undefined)
let hobbyId: string; // (optional) (default to undefined)
let startTime: string; // (optional) (default to undefined)
let endTime: string; // (optional) (default to undefined)
let notes: string; // (optional) (default to undefined)
let images: Array<any>; // (optional) (default to undefined)
let deletedImageKeys: Array<string>; // (optional) (default to undefined)

const { status, data } = await apiInstance.patchHobbySessionById(
    id,
    hobbyId,
    startTime,
    endTime,
    notes,
    images,
    deletedImageKeys
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **hobbyId** | [**string**] |  | (optional) defaults to undefined|
| **startTime** | [**string**] |  | (optional) defaults to undefined|
| **endTime** | [**string**] |  | (optional) defaults to undefined|
| **notes** | [**string**] |  | (optional) defaults to undefined|
| **images** | **Array&lt;any&gt;** |  | (optional) defaults to undefined|
| **deletedImageKeys** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|


### Return type

**GetHobbySessionById200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Updated session |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**413** | Content Too Large |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postHobbySession**
> GetHobbySessionById200Response postHobbySession()


### Example

```typescript
import {
    HobbySessionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionApi(configuration);

let hobbyId: string; // (default to undefined)
let startTime: string; // (default to undefined)
let endTime: string; // (default to undefined)
let notes: string; // (optional) (default to undefined)
let images: Array<any>; // (optional) (default to undefined)

const { status, data } = await apiInstance.postHobbySession(
    hobbyId,
    startTime,
    endTime,
    notes,
    images
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hobbyId** | [**string**] |  | defaults to undefined|
| **startTime** | [**string**] |  | defaults to undefined|
| **endTime** | [**string**] |  | defaults to undefined|
| **notes** | [**string**] |  | (optional) defaults to undefined|
| **images** | **Array&lt;any&gt;** |  | (optional) defaults to undefined|


### Return type

**GetHobbySessionById200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**413** | Content Too Large |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

