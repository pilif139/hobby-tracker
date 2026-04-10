import { createUserRepository } from '../user/user.factory';
import { FollowRepository } from './follow.repository';
import { FollowService } from './follow.service';
import type { PrismaClient } from '@/prisma/generated/client';

export function createFollowRepository(prisma: PrismaClient) {
  return new FollowRepository(prisma);
}

export function createFollowService(prisma: PrismaClient) {
  const followRepository = createFollowRepository(prisma);
  const userRepository = createUserRepository(prisma);
  return new FollowService(followRepository, userRepository);
}
