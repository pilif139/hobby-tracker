import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { HTTPException } from 'hono/http-exception';

import { secureHeaders } from 'hono/secure-headers';
import { createOpenApiDocument, openApi } from 'hono-zod-openapi';
import z from 'zod';
import { getPrismaClient } from './lib/prisma';
// import { cacheMiddleware } from './middleware/cache';
import { authMiddleware } from './middleware/auth';
import { dependencyMiddleware } from './middleware/dependencies';
import { loggerMiddleware } from './middleware/logger';
import { authController } from './modules/auth/auth.controller';
import userController from './modules/user/user.controller';
import { corsMiddleware } from '@/src/middleware/cors';
import { csrfMiddleware } from '@/src/middleware/csrf';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>()
  .use(
    '*',
    loggerMiddleware,
    secureHeaders(),
    corsMiddleware,
    csrfMiddleware,
    dependencyMiddleware,
    authMiddleware,
  )
  .route('/auth', authController)
  .route('/user', userController)
  .get(
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
          c.get('logger').error(
            `Database connection error: ${error instanceof Error ? error.message : (error as string)}`,
          );
          throw new HTTPException(500, {
            message: 'Database connection failed',
          });
        });
    },
  )
  .get(
    '/scalar',
    Scalar({
      url: '/doc',
      theme: 'deepSpace',
    }),
  )
  .onError((err, c) => {
    c.get('logger').error(`Unhandled Error: ${err.message}`);
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    return c.json({ message: `Internal Server Error: ${err.message}` }, 500);
  });

createOpenApiDocument(app, {
  info: {
    title: 'Hobby Tracker API',
    version: '1.0.0',
  },
});

// TODO: maybe refactor this into its own file; still need to research how to do this cleanly with hono

showRoutes(app, {
  verbose: true,
});

export default {
  port: 3000,
  fetch: app.fetch,
};
export type AppType = typeof app;
