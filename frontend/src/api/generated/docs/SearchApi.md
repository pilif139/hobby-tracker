# SearchApi

All URIs are relative to _http://localhost_

| Method                    | HTTP request   | Description |
| ------------------------- | -------------- | ----------- |
| [**getHobby**](#gethobby) | **GET** /hobby |             |

# **getHobby**

> Array<object> getHobby()

### Example

```typescript
import { SearchApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new SearchApi(configuration);

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
