import type { PrismaClient } from '@/prisma/generated/client';
import type { UserService } from '@/src/modules/user/user.service';

export interface Bindings {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: 'development' | 'production';
}

export interface Variables {
  prisma: PrismaClient;
  services: {
    user: UserService;
  };
}

export interface AppContext {
  Bindings: Bindings;
  Variables: Variables;
}
