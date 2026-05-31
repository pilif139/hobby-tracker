# HobbySessionTestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**postHobbySession**](#posthobbysession) | **POST** /hobby-session | |

# **postHobbySession**
> GetHobbySessionById200Response postHobbySession()


### Example

```typescript
import {
    HobbySessionTestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HobbySessionTestApi(configuration);

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

