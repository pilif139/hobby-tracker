import type { PrismaClient } from '@/prisma/generated/client';
import { HobbyRepository } from '@/src/modules/hobby/hobby.repository';
import { HobbyService } from '@/src/modules/hobby/hobby.service';

export function createHobbyService(prisma: PrismaClient) {
  const repository = createHobbyRepository(prisma);
  return new HobbyService(repository);
}

export function createHobbyRepository(prisma: PrismaClient) {
  return new HobbyRepository(prisma);
}
