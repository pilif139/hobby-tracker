import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';

export function createUserService(
  db: D1Database,
  bucket: R2Bucket,
  BUCKET_URL: string,
) {
  const prisma = getPrismaClient(db);
  const repository = createUserRepository(prisma, bucket);
  return new UserService(repository, BUCKET_URL);
}

export function createUserRepository(prisma: PrismaClient, bucket: R2Bucket) {
  return new UserRepository(prisma, bucket);
}
