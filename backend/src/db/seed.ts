import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { Database } from 'bun:sqlite';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from '../lib/hash';

const DATABASE_DIRECTORY = resolve(
  process.cwd(),
  '.wrangler',
  'state',
  'v3',
  'd1',
  'miniflare-D1DatabaseObject',
);

function findLocalD1DatabaseFile(): string {
  const entries = readdirSync(DATABASE_DIRECTORY, { withFileTypes: true });
  const databaseFile = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sqlite'))
    .map((entry) => join(DATABASE_DIRECTORY, entry.name))
    .find((filePath) => !filePath.includes('metadata.sqlite'));

  if (!databaseFile) {
    throw new Error(
      `Could not find a local D1 database file in ${DATABASE_DIRECTORY}. Start Wrangler once so the local database is created.`,
    );
  }

  return databaseFile;
}

function createD1Meta(
  databaseFile: string,
  changes: number,
  lastRowId: number,
  rowsRead: number,
) {
  return {
    duration: 0,
    size_after: statSync(databaseFile).size,
    rows_read: rowsRead,
    rows_written: changes,
    last_row_id: lastRowId,
    changed_db: changes > 0,
    changes,
  };
}

function createD1Result<T>(
  databaseFile: string,
  rows: T[],
  changes: number,
  lastRowId: number,
): D1Result<T> {
  return {
    success: true,
    meta: createD1Meta(databaseFile, changes, lastRowId, rows.length),
    results: rows,
  };
}

class BunD1PreparedStatement {
  constructor(
    private readonly statement: ReturnType<Database['prepare']>,
    private readonly boundValues: unknown[] = [],
    private readonly databaseFile: string,
  ) {}

  bind(...values: unknown[]) {
    return new BunD1PreparedStatement(
      this.statement,
      values,
      this.databaseFile,
    );
  }

  first<T = unknown>(colName?: string): Promise<T | null> {
    const row = this.statement.get(...this.boundValues) as Record<
      string,
      unknown
    > | null;
    if (!row) {
      return Promise.resolve(null);
    }

    if (typeof colName === 'string') {
      return Promise.resolve((row[colName] ?? null) as T | null);
    }

    return Promise.resolve(row as T | null);
  }

  run<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    const result = this.statement.run(...this.boundValues);
    return Promise.resolve(
      createD1Result<T>(
        this.databaseFile,
        [],
        result.changes,
        Number(result.lastInsertRowid ?? 0),
      ),
    );
  }

  all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    const rows = this.statement.all(...this.boundValues) as T[];
    return Promise.resolve(createD1Result<T>(this.databaseFile, rows, 0, 0));
  }

  raw<T = unknown[]>(options?: { columnNames?: false }): Promise<T[]>;
  raw<T = unknown[]>(options: {
    columnNames: true;
  }): Promise<[string[], ...T[]]>;
  raw<T = unknown[]>(options?: {
    columnNames?: boolean;
  }): Promise<T[] | [string[], ...T[]]> {
    const rows = this.statement.values(...this.boundValues) as T[];
    if (options?.columnNames) {
      return Promise.resolve([Array.from(this.statement.columnNames), ...rows]);
    }

    return Promise.resolve(rows);
  }
}

class BunD1Session {
  constructor(private readonly database: BunD1Database) {}

  prepare(query: string) {
    return this.database.prepare(query);
  }

  batch<T = unknown>(statements: BunD1PreparedStatement[]) {
    return this.database.batch<T>(statements);
  }

  getBookmark() {
    return null;
  }
}

class BunD1Database {
  private readonly database: Database;

  constructor(private readonly databaseFile: string) {
    this.database = new Database(databaseFile, {
      create: true,
      strict: true,
    });
  }

  prepare(query: string) {
    return new BunD1PreparedStatement(
      this.database.prepare(query),
      [],
      this.databaseFile,
    );
  }

  async batch<T = unknown>(statements: BunD1PreparedStatement[]) {
    const results = [] as D1Result<T>[];

    for (const statement of statements) {
      results.push(await statement.run<T>());
    }

    return results;
  }

  exec(query: string) {
    const result = this.database.run(query);
    return Promise.resolve({
      count: result.changes,
      duration: 0,
    } satisfies D1ExecResult);
  }

  withSession() {
    return new BunD1Session(this);
  }

  dump() {
    const serialized = this.database.serialize();
    return Promise.resolve(
      serialized.buffer.slice(
        serialized.byteOffset,
        serialized.byteOffset + serialized.byteLength,
      ),
    );
  }

  close() {
    this.database.close(true);
  }
}

const databaseFile = findLocalD1DatabaseFile();
const localDatabase = new BunD1Database(databaseFile);
const prisma = new PrismaClient({
  adapter: new PrismaD1(localDatabase as unknown as D1Database),
});

const userIds = {
  alice: '11111111-1111-4111-8111-111111111111',
  marek: '22222222-2222-4222-8222-222222222222',
  zoe: '33333333-3333-4333-8333-333333333333',
  piotr: '44444444-4444-4444-8444-444444444444',
} as const;

const hobbyIds = {
  running: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  guitar: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  reading: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  cooking: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  photography: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
} as const;

const sessionIds = {
  aliceRunning: '10000000-0000-4000-8000-000000000001',
  aliceReading: '10000000-0000-4000-8000-000000000002',
  marekGuitar: '10000000-0000-4000-8000-000000000003',
  marekPhoto: '10000000-0000-4000-8000-000000000004',
  zoeCooking: '10000000-0000-4000-8000-000000000005',
  zoeRunning: '10000000-0000-4000-8000-000000000006',
  piotrReading: '10000000-0000-4000-8000-000000000007',
  piotrGuitar: '10000000-0000-4000-8000-000000000008',
} as const;

const followIds = {
  aliceFollowsMarek: '20000000-0000-4000-8000-000000000001',
  aliceFollowsZoe: '20000000-0000-4000-8000-000000000002',
  marekFollowsAlice: '20000000-0000-4000-8000-000000000003',
  marekFollowsZoe: '20000000-0000-4000-8000-000000000004',
  zoeFollowsPiotr: '20000000-0000-4000-8000-000000000005',
  piotrFollowsAlice: '20000000-0000-4000-8000-000000000006',
} as const;

const seedUsers = [
  {
    id: userIds.alice,
    email: 'alice.nowak@example.com',
    name: 'Alice Nowak',
    avatarFileKey: 'avatars/alice-nowak.webp',
  },
  {
    id: userIds.marek,
    email: 'marek.kaczmarek@example.com',
    name: 'Marek Kaczmarek',
    avatarFileKey: 'avatars/marek-kaczmarek.webp',
  },
  {
    id: userIds.zoe,
    email: 'zoe.szabo@example.com',
    name: 'Zoe Szabo',
    avatarFileKey: 'avatars/zoe-szabo.webp',
  },
  {
    id: userIds.piotr,
    email: 'piotr.lewandowski@example.com',
    name: 'Piotr Lewandowski',
    avatarFileKey: null,
  },
] as const;

const seedHobbies = [
  {
    id: hobbyIds.running,
    name: 'Morning Running',
    description: 'Easy runs, intervals, and weekend park loops.',
    userIds: [userIds.alice, userIds.marek, userIds.zoe],
  },
  {
    id: hobbyIds.guitar,
    name: 'Guitar Practice',
    description: 'Chord drills, scales, and learning new songs.',
    userIds: [userIds.alice, userIds.piotr],
  },
  {
    id: hobbyIds.reading,
    name: 'Reading',
    description: 'Mostly non-fiction and a few long-form novels.',
    userIds: [userIds.alice, userIds.marek, userIds.zoe, userIds.piotr],
  },
  {
    id: hobbyIds.cooking,
    name: 'Cooking',
    description: 'Meal prep, new recipes, and weekend baking.',
    userIds: [userIds.zoe, userIds.piotr],
  },
  {
    id: hobbyIds.photography,
    name: 'Photography',
    description: 'Street photography and editing outdoor shots.',
    userIds: [userIds.marek, userIds.zoe],
  },
] as const;

const seedFollows = [
  {
    id: followIds.aliceFollowsMarek,
    followerId: userIds.alice,
    followingId: userIds.marek,
  },
  {
    id: followIds.aliceFollowsZoe,
    followerId: userIds.alice,
    followingId: userIds.zoe,
  },
  {
    id: followIds.marekFollowsAlice,
    followerId: userIds.marek,
    followingId: userIds.alice,
  },
  {
    id: followIds.marekFollowsZoe,
    followerId: userIds.marek,
    followingId: userIds.zoe,
  },
  {
    id: followIds.zoeFollowsPiotr,
    followerId: userIds.zoe,
    followingId: userIds.piotr,
  },
  {
    id: followIds.piotrFollowsAlice,
    followerId: userIds.piotr,
    followingId: userIds.alice,
  },
] as const;

const seedSessions = [
  {
    id: sessionIds.aliceRunning,
    userId: userIds.alice,
    hobbyId: hobbyIds.running,
    startTime: new Date('2026-05-28T06:30:00.000Z'),
    endTime: new Date('2026-05-28T07:15:00.000Z'),
    notes: 'Easy tempo around the park after work.',
  },
  {
    id: sessionIds.aliceReading,
    userId: userIds.alice,
    hobbyId: hobbyIds.reading,
    startTime: new Date('2026-05-29T19:00:00.000Z'),
    endTime: new Date('2026-05-29T19:35:00.000Z'),
    notes: 'Finished the last chapter of a productivity book.',
  },
  {
    id: sessionIds.marekGuitar,
    userId: userIds.marek,
    hobbyId: hobbyIds.guitar,
    startTime: new Date('2026-05-27T20:00:00.000Z'),
    endTime: new Date('2026-05-27T21:00:00.000Z'),
    notes: 'Worked on chord transitions and a new indie song.',
  },
  {
    id: sessionIds.marekPhoto,
    userId: userIds.marek,
    hobbyId: hobbyIds.photography,
    startTime: new Date('2026-05-30T08:00:00.000Z'),
    endTime: new Date('2026-05-30T09:30:00.000Z'),
    notes: 'Golden hour walk with a compact camera.',
  },
  {
    id: sessionIds.zoeCooking,
    userId: userIds.zoe,
    hobbyId: hobbyIds.cooking,
    startTime: new Date('2026-05-26T17:00:00.000Z'),
    endTime: new Date('2026-05-26T17:40:00.000Z'),
    notes: 'Prepared lunches for the next three days.',
  },
  {
    id: sessionIds.zoeRunning,
    userId: userIds.zoe,
    hobbyId: hobbyIds.running,
    startTime: new Date('2026-05-31T07:00:00.000Z'),
    endTime: new Date('2026-05-31T07:35:00.000Z'),
    notes: 'Short recovery run with a few strides.',
  },
  {
    id: sessionIds.piotrReading,
    userId: userIds.piotr,
    hobbyId: hobbyIds.reading,
    startTime: new Date('2026-05-24T21:00:00.000Z'),
    endTime: new Date('2026-05-24T21:50:00.000Z'),
    notes: 'Read on the balcony with tea.',
  },
  {
    id: sessionIds.piotrGuitar,
    userId: userIds.piotr,
    hobbyId: hobbyIds.guitar,
    startTime: new Date('2026-05-28T18:30:00.000Z'),
    endTime: new Date('2026-05-28T19:40:00.000Z'),
    notes: 'Practiced fingerpicking and a blues progression.',
  },
] as const;

const seedFiles = [
  {
    storageObjectKey: 'session-files/alice-running-2026-05-28-note.pdf',
    hobbySessionId: sessionIds.aliceRunning,
  },
  {
    storageObjectKey: 'session-files/marek-photo-2026-05-30-contact-sheet.jpg',
    hobbySessionId: sessionIds.marekPhoto,
  },
  {
    storageObjectKey: 'session-files/zoe-cooking-2026-05-26-recipe.jpg',
    hobbySessionId: sessionIds.zoeCooking,
  },
  {
    storageObjectKey: 'session-files/piotr-guitar-2026-05-28-setlist.txt',
    hobbySessionId: sessionIds.piotrGuitar,
  },
] as const;

async function seed() {
  const passwordHash = await createHash('Password123!');

  await prisma.$transaction(async (tx) => {
    await tx.hobbySessionFile.deleteMany();
    await tx.hobbySession.deleteMany();
    await tx.follow.deleteMany();
    await tx.hobby.deleteMany();
    await tx.user.deleteMany();
  });

  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: passwordHash,
        ...(user.avatarFileKey ? { avatarFileKey: user.avatarFileKey } : {}),
      },
      update: {
        email: user.email,
        name: user.name,
        password: passwordHash,
        avatarFileKey: user.avatarFileKey,
      },
    });
  }

  for (const hobby of seedHobbies) {
    const connectedUsers = hobby.userIds.map((id) => ({ id }));

    await prisma.hobby.upsert({
      where: { id: hobby.id },
      create: {
        id: hobby.id,
        name: hobby.name,
        description: hobby.description,
        users: {
          connect: connectedUsers,
        },
      },
      update: {
        name: hobby.name,
        description: hobby.description,
        users: {
          connect: connectedUsers,
        },
      },
    });
  }

  for (const follow of seedFollows) {
    await prisma.follow.upsert({
      where: { id: follow.id },
      create: {
        id: follow.id,
        followerId: follow.followerId,
        followingId: follow.followingId,
      },
      update: {
        followerId: follow.followerId,
        followingId: follow.followingId,
      },
    });
  }

  for (const session of seedSessions) {
    await prisma.hobbySession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        userId: session.userId,
        hobbyId: session.hobbyId,
        startTime: session.startTime,
        endTime: session.endTime,
        notes: session.notes,
      },
      update: {
        userId: session.userId,
        hobbyId: session.hobbyId,
        startTime: session.startTime,
        endTime: session.endTime,
        notes: session.notes,
      },
    });
  }

  for (const file of seedFiles) {
    await prisma.hobbySessionFile.upsert({
      where: { storageObjectKey: file.storageObjectKey },
      create: {
        storageObjectKey: file.storageObjectKey,
        hobbySessionId: file.hobbySessionId,
      },
      update: {
        hobbySessionId: file.hobbySessionId,
      },
    });
  }

  console.log('Seed completed successfully.');
}

async function main() {
  try {
    await seed();
  } catch (error) {
    console.error('Seed failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    localDatabase.close();
    await prisma.$disconnect();
  }
}

void main();
