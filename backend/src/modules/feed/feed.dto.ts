import z from 'zod';

export const feedQueryDto = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

export const suggestionQueryDto = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

export const hobbySuggestionQueryDto = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
  period: z.enum(['week', 'month']).optional(),
});

export const feedSessionSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  hobby: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const feedResponseSchema = z.object({
  sessions: z.array(feedSessionSchema),
  nextCursor: z.string().nullable(),
});

export const hobbyFollowSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  sharedHobbyCount: z.number(),
  sharedHobbies: z.array(z.string()),
});

export const socialFollowSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  mutualConnectionCount: z.number(),
});

export const hobbySuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  sessionCount: z.number(),
  userCount: z.number(),
});

export const hobbyFollowSuggestionsResponseSchema = z.object({
  suggestions: z.array(hobbyFollowSuggestionSchema),
});

export const socialFollowSuggestionsResponseSchema = z.object({
  suggestions: z.array(socialFollowSuggestionSchema),
});

export const hobbySuggestionsResponseSchema = z.object({
  suggestions: z.array(hobbySuggestionSchema),
});
