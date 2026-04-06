# GetByIdApi

All URIs are relative to _http://localhost_

| Method                            | HTTP request        | Description |
| --------------------------------- | ------------------- | ----------- |
| [**getHobbyById**](#gethobbybyid) | **GET** /hobby/{id} |             |
| [**getUserById**](#getuserbyid)   | **GET** /user/{id}  |             |

# **getHobbyById**

> object getHobbyById()

### Example

```typescript
import { GetByIdApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GetByIdApi(configuration);

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

# **getUserById**

> GetUserById200Response getUserById()

### Example

```typescript
import { GetByIdApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GetByIdApi(configuration);

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
