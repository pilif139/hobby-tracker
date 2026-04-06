# UploadNewImageApi

All URIs are relative to _http://localhost_

| Method                                                              | HTTP request                           | Description |
| ------------------------------------------------------------------- | -------------------------------------- | ----------- |
| [**postHobbyUploadImageByHobbyId**](#posthobbyuploadimagebyhobbyid) | **POST** /hobby/upload-image/{hobbyId} |             |

# **postHobbyUploadImageByHobbyId**

> PostAuthLogout200Response postHobbyUploadImageByHobbyId()

### Example

```typescript
import { UploadNewImageApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new UploadNewImageApi(configuration);

let hobbyId: string; // (default to undefined)
let image: any; // (default to undefined)

const { status, data } = await apiInstance.postHobbyUploadImageByHobbyId(
  hobbyId,
  image,
);
```

### Parameters

| Name        | Type         | Description | Notes                 |
| ----------- | ------------ | ----------- | --------------------- |
| **hobbyId** | [**string**] |             | defaults to undefined |
| **image**   | **any**      |             | defaults to undefined |

### Return type

**PostAuthLogout200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | Uploaded    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
