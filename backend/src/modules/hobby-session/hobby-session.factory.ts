import { HobbySessionRepository } from './hobby-session.repository';
import { HobbySessionService } from './hobby-session.service';
import type { PrismaClient } from '@/prisma/generated/client';
import { getPrismaClient } from '@/src/lib/prisma';

export function createHobbySessionRepository(
  prisma: PrismaClient,
  bucket: R2Bucket,
) {
  return new HobbySessionRepository(prisma, bucket);
}

export function createHobbySessionService(
  db: D1Database,
  bucket: R2Bucket,
  BUCKET_URL: string,
) {
  const prisma = getPrismaClient(db);
  const repo = createHobbySessionRepository(prisma, bucket);
  return new HobbySessionService(repo, BUCKET_URL);
}
