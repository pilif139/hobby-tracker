import { createMiddleware } from 'hono/factory';
import type { AppContext } from '../types';

export const authMiddleware = createMiddleware<AppContext>(
  async (c, next) => {},
);
