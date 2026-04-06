# UpdateApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**patchUserById**](#patchuserbyid) | **PATCH** /user/{id} | |

# **patchUserById**
> PostAuthLogin200Response patchUserById(patchUserByIdRequest)


### Example

```typescript
import {
    UpdateApi,
    Configuration,
    PatchUserByIdRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UpdateApi(configuration);

let id: string; // (default to undefined)
let patchUserByIdRequest: PatchUserByIdRequest; //

const { status, data } = await apiInstance.patchUserById(
    id,
    patchUserByIdRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchUserByIdRequest** | **PatchUserByIdRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | Updated User |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

