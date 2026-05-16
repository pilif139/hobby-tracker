import type { Logger } from 'lib';
import type { AuthService } from './modules/auth/auth.service';
import type { FeedService } from './modules/feed/feed.service';
import type { FollowService } from './modules/follow/follow.service';
import type { HobbyService } from './modules/hobby/hobby.service';
import type { HobbySessionService } from './modules/hobby-session/hobby-session.service';
import type { UserService } from './modules/user/user.service';

export interface Bindings {
  DB: D1Database;
  authKV: KVNamespace;
  R2: R2Bucket;
  SEND_EMAIL: SendEmail;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: 'development' | 'production';
  R2_BUCKET_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  FRONTEND_DOMAIN: string;
}

export interface Variables {
  userId: string;
  services: {
    user: UserService;
    auth: AuthService;
    hobby: HobbyService;
    hobbySession: HobbySessionService;
    follow: FollowService;
    feed: FeedService;
  };
  logger: Logger;
}

export interface AppContext {
  Bindings: Bindings;
  Variables: Variables;
}
