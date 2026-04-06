# HealthCheckApi

All URIs are relative to _http://localhost_

| Method                      | HTTP request    | Description |
| --------------------------- | --------------- | ----------- |
| [**getHealth**](#gethealth) | **GET** /health |             |

# **getHealth**

> GetHealth200Response getHealth()

### Example

```typescript
import { HealthCheckApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new HealthCheckApi(configuration);

const { status, data } = await apiInstance.getHealth();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**GetHealth200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description     | Response headers |
| ----------- | --------------- | ---------------- |
| **200**     | Health check OK | -                |
| **500**     | Server Error    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
