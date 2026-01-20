import { csrf } from 'hono/csrf';
import { createMiddleware } from 'hono/factory';
import { AppContext } from '../types';

export const csrfMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',') || [];

  const handler = csrf({
    origin: allowedOrigins.map((origin) => origin.trim()),
  });

  await handler(c, next);
});
