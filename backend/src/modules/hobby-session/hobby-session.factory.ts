import { HobbySessionRepository } from './hobby-session.repository';
import { HobbySessionService } from './hobby-session.service';
import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';

export function createHobbySessionRepository(prisma: PrismaClient) {
  return new HobbySessionRepository(prisma);
}

export function createHobbySessionService(db: D1Database) {
  const prisma = getPrismaClient(db);
  const repo = createHobbySessionRepository(prisma);
  return new HobbySessionService(repo);
}
