import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import type { AppContext } from '@/src/types';

export const corsMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',');

  const handler = cors({
    origin: (origin) => {
      if (!origin) {
        return null;
      }
      return allowedOrigins.includes(origin) ? origin : null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 24 * 60 * 60,
  });

  await handler(c, next);
});
