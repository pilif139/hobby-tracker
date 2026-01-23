import { csrf } from 'hono/csrf';
import { createMiddleware } from 'hono/factory';
import type { AppContext } from '@/src/types';

export const csrfMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',');
  const handler = csrf({
    origin: allowedOrigins.map((origin) => origin.trim()),
  });
  return handler(c, next);
});
