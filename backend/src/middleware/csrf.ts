import { csrf } from 'hono/csrf';
import { createMiddleware } from 'hono/factory';
import type { AppContext } from '@/src/types';

export const csrfMiddleware = createMiddleware<AppContext>(async (c, next) => {
  // Native mobile clients don't send an Origin header so we are skipping this check for them
  const origin = c.req.header('origin');
  if (!origin) {
    await next();
    return;
  }

  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',');
  const handler = csrf({
    origin: allowedOrigins.map((o) => o.trim()),
  });
  return handler(c, next);
});
