# GetByUserApi

All URIs are relative to _http://localhost_

| Method                                            | HTTP request                 | Description |
| ------------------------------------------------- | ---------------------------- | ----------- |
| [**getHobbyUserByUserId**](#gethobbyuserbyuserid) | **GET** /hobby/user/{userId} |             |

# **getHobbyUserByUserId**

> Array<GetHobbyUserByUserId200ResponseInner> getHobbyUserByUserId()

### Example

```typescript
import { GetByUserApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GetByUserApi(configuration);

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
