import { FeedRepository } from './feed.repository';
import { FeedService } from './feed.service';
import { getPrismaClient } from '@/src/lib/prisma';
import type { FollowService } from '@/src/modules/follow/follow.service';

export function createFeedRepository(db: D1Database) {
  const prisma = getPrismaClient(db);
  return new FeedRepository(prisma);
}

export function createFeedService(
  db: D1Database,
  followService: FollowService,
  BUCKET_URL: string,
) {
  const repo = createFeedRepository(db);
  return new FeedService(repo, followService, BUCKET_URL);
}
