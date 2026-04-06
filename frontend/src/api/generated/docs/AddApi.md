# AddApi

All URIs are relative to _http://localhost_

| Method                                                                | HTTP request                             | Description |
| --------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| [**postHobbyAddToProfileByHobbyId**](#posthobbyaddtoprofilebyhobbyid) | **POST** /hobby/add-to-profile/{hobbyId} |             |

# **postHobbyAddToProfileByHobbyId**

> PostAuthLogout200Response postHobbyAddToProfileByHobbyId()

### Example

```typescript
import { AddApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new AddApi(configuration);

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
