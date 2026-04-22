import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';

export function createUserService(db: D1Database) {
  const prisma = getPrismaClient(db);
  const repository = createUserRepository(prisma);
  return new UserService(repository);
}

export function createUserRepository(prisma: PrismaClient) {
  return new UserRepository(prisma);
}
