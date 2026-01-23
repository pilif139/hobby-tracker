import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@/prisma/generated/client';

const prismaClient = new WeakMap<D1Database, PrismaClient>();

export function getPrismaClient(db: D1Database): PrismaClient {
  const existingClient = prismaClient.get(db);
  if (existingClient) {
    return existingClient;
  }

  const adapter = new PrismaD1(db);
  const client = new PrismaClient({ adapter });
  prismaClient.set(db, client);
  return client;
}
