import { cache } from 'hono/cache';
import { createMiddleware } from 'hono/factory';
import type { AppContext } from '@/src/types';

export const cacheMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const handler = cache({
    cacheName: 'hobby-tracker-cache',
    cacheControl: 'max-age=3600',
    cacheableStatusCodes: [200, 304, 404],
  });

  return handler(c, next);
});
