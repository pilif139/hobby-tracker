import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { AppContext } from '@/types';
import { corsMiddleware } from '@/middleware/cors';
import { csrfMiddleware } from '@/middleware/csrf';
import { cacheMiddleware } from './middleware/cache';
import { showRoutes } from 'hono/dev';

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
