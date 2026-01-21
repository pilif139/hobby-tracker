import { PrismaD1 } from '@prisma/adapter-d1';
import { createMiddleware } from 'hono/factory';
import { PrismaClient } from '@/prisma/generated/client';
import type { AppContext } from '@/src/types';

export const prismaMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    c.set('prisma', prisma);
    await next();
    await prisma.$disconnect();
  },
);
