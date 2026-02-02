import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { ConsoleTransport, Logger } from 'lib';
import type { Transport } from 'lib';
import type { AppContext } from '../types';

export const loggerMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const transports: Transport[] = [];
    if (c.env.ENVIRONMENT === 'development') {
      transports.push(new ConsoleTransport());
    }

    const customLogger = new Logger({
      environment: c.env.ENVIRONMENT,
      transports,
      waitUntil: (promise: Promise<unknown>) => {
        c.executionCtx.waitUntil(promise);
      },
    });
    c.set('logger', customLogger);

    const honoLoggerHandler = logger((message: string, ...rest: string[]) => {
      customLogger.info(message, {
        rest: rest.length > 0 ? rest : undefined,
      });
    });

    await honoLoggerHandler(c, next);
  },
);
