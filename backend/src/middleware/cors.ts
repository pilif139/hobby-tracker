import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import type { AppContext } from '@/src/types';

export const corsMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',').map((origin) =>
    origin.trim(),
  );

  const requestOrigin = c.req.header('Origin');
  console.log(
    `[CORS] ${c.req.method} ${c.req.path} | Origin: ${requestOrigin ?? '(none)'} | Allowed: ${allowedOrigins.join(', ')}`,
  );

  const handler = cors({
    origin: (origin) => {
      if (!origin) {
        console.log('[CORS] No origin header — returning null');
        return null;
      }
      const allowed = allowedOrigins.includes(origin);
      console.log(
        `[CORS] Origin "${origin}" → ${allowed ? 'allowed' : 'blocked'}`,
      );
      return allowed ? origin : null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 24 * 60 * 60,
  });

  return handler(c, next);
});
