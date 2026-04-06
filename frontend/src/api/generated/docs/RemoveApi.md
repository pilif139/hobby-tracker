# RemoveApi

All URIs are relative to _http://localhost_

| Method                                                                              | HTTP request                                    | Description |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- | ----------- |
| [**deleteHobbyRemoveFromProfileByHobbyId**](#deletehobbyremovefromprofilebyhobbyid) | **DELETE** /hobby/remove-from-profile/{hobbyId} |             |

# **deleteHobbyRemoveFromProfileByHobbyId**

> PostAuthLogout200Response deleteHobbyRemoveFromProfileByHobbyId()

### Example

```typescript
import { RemoveApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new RemoveApi(configuration);

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
