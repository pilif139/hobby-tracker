import { Scalar } from '@scalar/hono-api-reference';
import { showRoutes } from 'hono/dev';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { secureHeaders } from 'hono/secure-headers';
import { describeRoute, openAPIRouteHandler, resolver } from 'hono-openapi';
import z from 'zod';
import { getPrismaClient } from './lib/prisma';
// import { cacheMiddleware } from './middleware/cache';
import { authMiddleware } from './middleware/auth';
import { dependencyMiddleware } from './middleware/dependencies';
import { loggerMiddleware } from './middleware/logger';
import { authController } from './modules/auth/auth.controller';
import hobbyController from './modules/hobby/hobby.controller';
import hobbySessionController from './modules/hobby-session/hobby-session.controller';
import userController from './modules/user/user.controller';
import { corsMiddleware } from '@/src/middleware/cors';
import { csrfMiddleware } from '@/src/middleware/csrf';
import type { AppContext } from '@/src/types';

export const app = new Hono<AppContext>();

app.use(
  '*',
  loggerMiddleware,
  secureHeaders(),
  corsMiddleware,
  csrfMiddleware,
  dependencyMiddleware,
  authMiddleware,
);

app.route('/auth', authController);
app.route('/user', userController);
app.route('/hobby', hobbyController);
app.route('/hobby-session', hobbySessionController);

app.get(
  '/health',
  describeRoute({
    tags: ['Health Check'],
    responses: {
      200: {
        description: 'Health check OK',
        content: {
          'application/json': {
            schema: resolver(z.object({ status: z.literal('ok') })),
          },
        },
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: resolver(z.object({ message: z.string() })),
          },
        },
      },
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
);

app.onError((err, c) => {
  c.get('logger').error(`Unhandled Error: ${err.message}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: `Internal Server Error: ${err.message}` }, 500);
});

// openapi docs

app.get(
  '/doc',
  async (c, next) => {
    if (c.env.ENVIRONMENT === 'production') {
      return c.json(
        { message: 'Documentation is not available in production' },
        403,
      );
    }
    return next();
  },
  openAPIRouteHandler(app, {
    documentation: {
      components: {
        securitySchemes: {
          accessTokenCookie: {
            type: 'apiKey',
            in: 'cookie',
            name: 'session',
          },
          refreshTokenCookie: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refresh',
          },
        },
      },
      security: [
        {
          accessTokenCookie: [],
          refreshTokenCookie: [],
        },
      ],
    },
  }),
);

app.get(
  '/scalar',
  async (c, next) => {
    if (c.env.ENVIRONMENT === 'production') {
      return c.json(
        { message: 'Documentation is not available in production' },
        403,
      );
    }
    return next();
  },
  Scalar({
    url: '/doc',
    theme: 'deepSpace',
  }),
);

showRoutes(app, {
  verbose: true,
});

export default {
  port: 3000,
  fetch: app.fetch,
};
