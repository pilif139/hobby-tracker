import type {
  GetFeed200Response,
  GetFeed200ResponseSessionsInner,
  GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner,
  GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner,
  GetFeedHobbySuggestions200ResponseSuggestionsInner,
  GetHobbySessionUserByUserId200Response,
} from '@/api/generated/api';

export type FeedTimelineResponse = GetFeed200Response;
export type FeedSession = GetFeed200ResponseSessionsInner;
export type HobbyFollowSuggestion =
  GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner;
export type SocialFollowSuggestion =
  GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner;
export type HobbySuggestion =
  GetFeedHobbySuggestions200ResponseSuggestionsInner;
export type MySessionsResponse = GetHobbySessionUserByUserId200Response;
