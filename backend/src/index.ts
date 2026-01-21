import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cacheMiddleware } from './middleware/cache';
import { corsMiddleware } from '@/src/middleware/cors';
import { csrfMiddleware } from '@/src/middleware/csrf';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', corsMiddleware);
app.use('*', csrfMiddleware);
// only get request are cached
app.get('*', cacheMiddleware);

app.get('/', (c) => {
  return c.text('Hello hono!');
});

showRoutes(app, {
  verbose: true,
});

export default {
  port: 3000,
  fetch: app.fetch,
};
