import { createMiddleware } from 'hono/factory';
import { ConsoleTransport, FileTransport, Logger } from 'lib';
import type { Transport } from 'lib';
import { join } from 'path';
import type { AppContext } from '../types';

export const loggerMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const transports: Transport[] = [];
    if (c.env.ENVIRONMENT === 'development') {
      transports.push(new ConsoleTransport());

      const logsDir = join(__dirname, '..', '..', 'logs');
      transports.push(new FileTransport(logsDir));
    }

    const customLogger = new Logger({
      environment: c.env.ENVIRONMENT,
      transports,
      waitUntil: (promise: Promise<unknown>) => {
        c.executionCtx.waitUntil(promise);
      },
    });
    c.set('logger', customLogger);

    await next();
  },
);
