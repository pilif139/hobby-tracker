import { HobbySessionRepository } from './hobby-session.repository';
import { HobbySessionService } from './hobby-session.service';
import type { PrismaClient } from '@/prisma/generated/client';

export function createHobbySessionRepository(prisma: PrismaClient) {
  return new HobbySessionRepository(prisma);
}

export function createHobbySessionService(prisma: PrismaClient) {
  const repo = createHobbySessionRepository(prisma);
  return new HobbySessionService(repo);
}
