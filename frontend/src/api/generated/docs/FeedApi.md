# FeedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getFeed**](#getfeed) | **GET** /feed | |
|[**getFeedFollowSuggestionsHobby**](#getfeedfollowsuggestionshobby) | **GET** /feed/follow-suggestions/hobby | |
|[**getFeedFollowSuggestionsSocial**](#getfeedfollowsuggestionssocial) | **GET** /feed/follow-suggestions/social | |
|[**getFeedHobbySuggestions**](#getfeedhobbysuggestions) | **GET** /feed/hobby-suggestions | |

# **getFeed**
> GetFeed200Response getFeed()


### Example

```typescript
import {
    FeedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedApi(configuration);

let limit: number; // (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getFeed(
    limit,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**GetFeed200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Paginated feed of followed users sessions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFeedFollowSuggestionsHobby**
> GetFeedFollowSuggestionsHobby200Response getFeedFollowSuggestionsHobby()


### Example

```typescript
import {
    FeedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedApi(configuration);

let limit: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getFeedFollowSuggestionsHobby(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|


### Return type

**GetFeedFollowSuggestionsHobby200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Users who share your hobbies |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFeedFollowSuggestionsSocial**
> GetFeedFollowSuggestionsSocial200Response getFeedFollowSuggestionsSocial()


### Example

```typescript
import {
    FeedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedApi(configuration);

let limit: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getFeedFollowSuggestionsSocial(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|


### Return type

**GetFeedFollowSuggestionsSocial200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Users followed by people you follow |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFeedHobbySuggestions**
> GetFeedHobbySuggestions200Response getFeedHobbySuggestions()


### Example

```typescript
import {
    FeedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedApi(configuration);

let limit: number; // (optional) (default to undefined)
let period: 'week' | 'month'; // (optional) (default to undefined)

const { status, data } = await apiInstance.getFeedHobbySuggestions(
    limit,
    period
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **period** | [**&#39;week&#39; | &#39;month&#39;**]**Array<&#39;week&#39; &#124; &#39;month&#39;>** |  | (optional) defaults to undefined|


### Return type

**GetFeedHobbySuggestions200Response**

### Authorization

[accessTokenCookie](../README.md#accessTokenCookie), [refreshTokenCookie](../README.md#refreshTokenCookie)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Trending hobbies you have not joined |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

