import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { createOpenApiDocument, openApi } from 'hono-zod-openapi';
import z from 'zod';
import { getPrismaClient } from './lib/prisma';
// import { cacheMiddleware } from './middleware/cache';
import { dependencyMiddleware } from './middleware/dependencies';
import { corsMiddleware } from '@/src/middleware/cors';
import { csrfMiddleware } from '@/src/middleware/csrf';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', corsMiddleware);
app.use('*', csrfMiddleware);
// only get request are cached
// app.get('*', cacheMiddleware);
app.use('*', dependencyMiddleware);

app.get(
  '/health',
  openApi({
    tags: ['Health Check'],
    responses: {
      200: z.object({ status: z.literal('ok') }),
      500: z.object({ message: z.string() }),
    },
  }),
  async (c) => {
    const prisma = getPrismaClient(c.env.DB);
    return prisma.$queryRaw`SELECT 1`
      .then(() => {
        return c.json({ status: 'ok' });
      })
      .catch((error: unknown) => {
        console.error('Database connection error:', error);
        throw new HTTPException(500, { message: 'Database connection failed' });
      });
  },
);

// OpenAPI and Swagger UI setup
app.get(
  '/swagger',
  swaggerUI({
    url: '/doc',
  }),
);

createOpenApiDocument(app, {
  info: {
    title: 'Hobby Tracker API',
    version: '1.0.0',
  },
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error('Unhandled Error:', err);
  return c.json({ message: `Internal Server Error: ${err.message}` }, 500);
});

showRoutes(app, {
  verbose: true,
});

export default {
  port: 3000,
  fetch: app.fetch,
};
