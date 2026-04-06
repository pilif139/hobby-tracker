# DeleteApi

All URIs are relative to _http://localhost_

| Method                                | HTTP request          | Description |
| ------------------------------------- | --------------------- | ----------- |
| [**deleteUserById**](#deleteuserbyid) | **DELETE** /user/{id} |             |

# **deleteUserById**

> deleteUserById()

### Example

```typescript
import { DeleteApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

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
