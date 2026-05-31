# FollowApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteFollow**](#deletefollow) | **DELETE** /follow | |
|[**postFollow**](#postfollow) | **POST** /follow | |

# **deleteFollow**
> PostFollow200Response deleteFollow(deleteFollowRequest)


### Example

```typescript
import {
    FollowApi,
    Configuration,
    DeleteFollowRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FollowApi(configuration);

let deleteFollowRequest: DeleteFollowRequest; //

const { status, data } = await apiInstance.deleteFollow(
    deleteFollowRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteFollowRequest** | **DeleteFollowRequest**|  | |


### Return type

**PostFollow200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Unfollow Result |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postFollow**
> PostFollow200Response postFollow(postFollowRequest)


### Example

```typescript
import {
    FollowApi,
    Configuration,
    PostFollowRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FollowApi(configuration);

let postFollowRequest: PostFollowRequest; //

const { status, data } = await apiInstance.postFollow(
    postFollowRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postFollowRequest** | **PostFollowRequest**|  | |


### Return type

**PostFollow200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Follow Result |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

