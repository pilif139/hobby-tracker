import type { UserService } from '@/src/modules/user/user.service';

export interface Bindings {
  DB: D1Database;
  authKV: KVNamespace;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: 'development' | 'production';
}

export interface Variables {
  services: {
    user: UserService;
  };
}

export interface AppContext {
  Bindings: Bindings;
  Variables: Variables;
}
