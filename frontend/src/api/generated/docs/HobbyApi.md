# HobbyApi

All URIs are relative to _http://localhost_

| Method                                                                              | HTTP request                                    | Description |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- | ----------- |
| [**deleteHobbyRemoveFromProfileByHobbyId**](#deletehobbyremovefromprofilebyhobbyid) | **DELETE** /hobby/remove-from-profile/{hobbyId} |             |
| [**getHobby**](#gethobby)                                                           | **GET** /hobby                                  |             |
| [**getHobbyById**](#gethobbybyid)                                                   | **GET** /hobby/{id}                             |             |
| [**getHobbyUserByUserId**](#gethobbyuserbyuserid)                                   | **GET** /hobby/user/{userId}                    |             |
| [**postHobby**](#posthobby)                                                         | **POST** /hobby                                 |             |
| [**postHobbyAddToProfileByHobbyId**](#posthobbyaddtoprofilebyhobbyid)               | **POST** /hobby/add-to-profile/{hobbyId}        |             |

# **deleteHobbyRemoveFromProfileByHobbyId**

> PostAuthLogout200Response deleteHobbyRemoveFromProfileByHobbyId()

### Example

```typescript
import { HobbyApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let hobbyId: string; // (default to undefined)

const { status, data } =
  await apiInstance.deleteHobbyRemoveFromProfileByHobbyId(hobbyId);
```

### Parameters

| Name        | Type         | Description | Notes                 |
| ----------- | ------------ | ----------- | --------------------- |
| **hobbyId** | [**string**] |             | defaults to undefined |

### Return type

**PostAuthLogout200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | Removed     | -                |
| **400**     | Bad Request | -                |
| **404**     | Not Found   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobby**

> Array<object> getHobby()

### Example

```typescript
import { HobbyApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let search: string; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getHobby(search, offset, limit);
```

### Parameters

| Name       | Type         | Description | Notes                            |
| ---------- | ------------ | ----------- | -------------------------------- |
| **search** | [**string**] |             | (optional) defaults to undefined |
| **offset** | [**number**] |             | (optional) defaults to undefined |
| **limit**  | [**number**] |             | (optional) defaults to undefined |

### Return type

**Array<object>**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description    | Response headers |
| ----------- | -------------- | ---------------- |
| **200**     | Search Results | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobbyById**

> object getHobbyById()

### Example

```typescript
import { HobbyApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getHobbyById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**object**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | Hobby       | -                |
| **404**     | Not Found   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHobbyUserByUserId**

> Array<GetHobbyUserByUserId200ResponseInner> getHobbyUserByUserId()

### Example

```typescript
import { HobbyApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getHobbyUserByUserId(userId);
```

### Parameters

| Name       | Type         | Description | Notes                 |
| ---------- | ------------ | ----------- | --------------------- |
| **userId** | [**string**] |             | defaults to undefined |

### Return type

**Array<GetHobbyUserByUserId200ResponseInner>**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description  | Response headers |
| ----------- | ------------ | ---------------- |
| **200**     | User Hobbies | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postHobby**

> object postHobby(postHobbyRequest)

### Example

```typescript
import { HobbyApi, Configuration, PostHobbyRequest } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let postHobbyRequest: PostHobbyRequest; //

const { status, data } = await apiInstance.postHobby(postHobbyRequest);
```

### Parameters

| Name                 | Type                 | Description | Notes |
| -------------------- | -------------------- | ----------- | ----- |
| **postHobbyRequest** | **PostHobbyRequest** |             |       |

### Return type

**object**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description   | Response headers |
| ----------- | ------------- | ---------------- |
| **201**     | Created Hobby | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postHobbyAddToProfileByHobbyId**

> PostAuthLogout200Response postHobbyAddToProfileByHobbyId()

### Example

```typescript
import { HobbyApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HobbyApi(configuration);

let hobbyId: string; // (default to undefined)

const { status, data } =
  await apiInstance.postHobbyAddToProfileByHobbyId(hobbyId);
```

### Parameters

| Name        | Type         | Description | Notes                 |
| ----------- | ------------ | ----------- | --------------------- |
| **hobbyId** | [**string**] |             | defaults to undefined |

### Return type

**PostAuthLogout200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | Added       | -                |
| **404**     | Not Found   | -                |
| **409**     | Conflict    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
