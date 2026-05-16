import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import {
  feedQueryDto,
  feedResponseSchema,
  hobbyFollowSuggestionsResponseSchema,
  hobbySuggestionQueryDto,
  hobbySuggestionsResponseSchema,
  socialFollowSuggestionsResponseSchema,
  suggestionQueryDto,
} from './feed.dto';
import { jsonResponse } from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const feedController = new Hono<AppContext>();

feedController.get(
  '/',
  describeRoute({
    tags: ['Feed'],
    responses: {
      200: jsonResponse(
        feedResponseSchema,
        'Paginated feed of followed users sessions',
      ),
    },
  }),
  validator('query', feedQueryDto),
  async (c) => {
    const userId = c.get('userId');
    const { limit = 20, cursor } = c.req.valid('query');
    const feedService = c.get('services').feed;

    const result = await feedService.getFeed(userId, limit, cursor);
    return c.json(result);
  },
);

feedController.get(
  '/follow-suggestions/hobby',
  describeRoute({
    tags: ['Feed'],
    responses: {
      200: jsonResponse(
        hobbyFollowSuggestionsResponseSchema,
        'Users who share your hobbies',
      ),
    },
  }),
  validator('query', suggestionQueryDto),
  async (c) => {
    const userId = c.get('userId');
    const { limit = 5 } = c.req.valid('query');
    const feedService = c.get('services').feed;

    const result = await feedService.getHobbyBasedFollowSuggestions(
      userId,
      limit,
    );
    return c.json(result);
  },
);

feedController.get(
  '/follow-suggestions/social',
  describeRoute({
    tags: ['Feed'],
    responses: {
      200: jsonResponse(
        socialFollowSuggestionsResponseSchema,
        'Users followed by people you follow',
      ),
    },
  }),
  validator('query', suggestionQueryDto),
  async (c) => {
    const userId = c.get('userId');
    const { limit = 5 } = c.req.valid('query');
    const feedService = c.get('services').feed;

    const result = await feedService.getSocialBasedFollowSuggestions(
      userId,
      limit,
    );
    return c.json(result);
  },
);

feedController.get(
  '/hobby-suggestions',
  describeRoute({
    tags: ['Feed'],
    responses: {
      200: jsonResponse(
        hobbySuggestionsResponseSchema,
        'Trending hobbies you have not joined',
      ),
    },
  }),
  validator('query', hobbySuggestionQueryDto),
  async (c) => {
    const userId = c.get('userId');
    const { limit = 5, period = 'week' } = c.req.valid('query');
    const feedService = c.get('services').feed;

    const result = await feedService.getTrendingHobbySuggestions(
      userId,
      period,
      limit,
    );
    return c.json(result);
  },
);

export default feedController;
