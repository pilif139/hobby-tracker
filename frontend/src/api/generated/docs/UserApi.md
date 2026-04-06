# UserApi

All URIs are relative to _http://localhost_

| Method                                | HTTP request          | Description |
| ------------------------------------- | --------------------- | ----------- |
| [**deleteUserById**](#deleteuserbyid) | **DELETE** /user/{id} |             |
| [**getUserById**](#getuserbyid)       | **GET** /user/{id}    |             |
| [**patchUserById**](#patchuserbyid)   | **PATCH** /user/{id}  |             |

# **deleteUserById**

> deleteUserById()

### Example

```typescript
import { UserApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteUserById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **204**     | No Content  | -                |
| **403**     | Forbidden   | -                |
| **404**     | Not Found   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserById**

> GetUserById200Response getUserById()

### Example

```typescript
import { UserApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getUserById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**GetUserById200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description  | Response headers |
| ----------- | ------------ | ---------------- |
| **200**     | User Profile | -                |
| **404**     | Not Found    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **patchUserById**

> PostAuthLogin200Response patchUserById(patchUserByIdRequest)

### Example

```typescript
import { UserApi, Configuration, PatchUserByIdRequest } from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)
let patchUserByIdRequest: PatchUserByIdRequest; //

const { status, data } = await apiInstance.patchUserById(
  id,
  patchUserByIdRequest,
);
```

### Parameters

| Name                     | Type                     | Description | Notes                 |
| ------------------------ | ------------------------ | ----------- | --------------------- |
| **patchUserByIdRequest** | **PatchUserByIdRequest** |             |                       |
| **id**                   | [**string**]             |             | defaults to undefined |

### Return type

**PostAuthLogin200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description  | Response headers |
| ----------- | ------------ | ---------------- |
| **200**     | Updated User | -                |
| **403**     | Forbidden    | -                |
| **404**     | Not Found    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
