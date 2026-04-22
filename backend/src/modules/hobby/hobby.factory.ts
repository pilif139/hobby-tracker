import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';
import { HobbyRepository } from '@/src/modules/hobby/hobby.repository';
import { HobbyService } from '@/src/modules/hobby/hobby.service';

export function createHobbyService(db: D1Database) {
  const prisma = getPrismaClient(db);
  const repository = createHobbyRepository(prisma);
  return new HobbyService(repository);
}

export function createHobbyRepository(prisma: PrismaClient) {
  return new HobbyRepository(prisma);
}
