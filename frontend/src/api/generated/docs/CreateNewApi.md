# CreateNewApi

All URIs are relative to _http://localhost_

| Method                      | HTTP request    | Description |
| --------------------------- | --------------- | ----------- |
| [**postHobby**](#posthobby) | **POST** /hobby |             |

# **postHobby**

> object postHobby(postHobbyRequest)

### Example

```typescript
import { CreateNewApi, Configuration, PostHobbyRequest } from './api';

const configuration = new Configuration();
const apiInstance = new CreateNewApi(configuration);

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
