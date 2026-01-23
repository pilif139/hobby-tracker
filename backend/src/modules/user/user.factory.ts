import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import type { PrismaClient } from '@/prisma/generated/client';

export function createUserService(prisma: PrismaClient) {
  const repository = createUserRepository(prisma);
  return new UserService(repository);
}

export function createUserRepository(prisma: PrismaClient) {
  return new UserRepository(prisma);
}
