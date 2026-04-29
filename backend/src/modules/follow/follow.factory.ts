import { createUserRepository } from '../user/user.factory';
import { FollowRepository } from './follow.repository';
import { FollowService } from './follow.service';
import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';

export function createFollowRepository(prisma: PrismaClient) {
  return new FollowRepository(prisma);
}

export function createFollowService(db: D1Database, bucket: R2Bucket) {
  const prisma = getPrismaClient(db);
  const followRepository = createFollowRepository(prisma);
  const userRepository = createUserRepository(prisma, bucket);
  return new FollowService(followRepository, userRepository);
}
