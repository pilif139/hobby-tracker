import { createMiddleware } from 'hono/factory';
import type { AppContext } from '../types';

const devOnly = createMiddleware<AppContext>(async (c, next) => {
  if (c.env.ENVIRONMENT !== 'development') {
    return c.json({ message: 'Not available in production' }, 403);
  }
  return next();
});

export default devOnly;
