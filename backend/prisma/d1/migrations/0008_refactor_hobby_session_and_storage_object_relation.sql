-- DropIndex
DROP INDEX "StoredObject_createdAt_idx";

-- DropIndex
DROP INDEX "StoredObject_uploadedByUserId_bucket_idx";

-- DropIndex
DROP INDEX "StoredObject_objectKey_key";

-- DropIndex
DROP INDEX "_HobbySessionToStoredObject_B_index";

-- DropIndex
DROP INDEX "_HobbySessionToStoredObject_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StoredObject";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HobbySessionToStoredObject";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "HobbySessionStorageObject" (
    "hobbySessionId" TEXT NOT NULL,
    "storageObjectId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "HobbySessionStorageObject_hobbySessionId_fkey" FOREIGN KEY ("hobbySessionId") REFERENCES "HobbySession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HobbySessionStorageObject_storageObjectId_fkey" FOREIGN KEY ("storageObjectId") REFERENCES "StorageObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StorageObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectKey" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL,
    "etag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "uploadedByUserId" TEXT,
    CONSTRAINT "StorageObject_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "avatarId" TEXT,
    CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "StorageObject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatarId", "createdAt", "email", "id", "name", "password", "updatedAt") SELECT "avatarId", "createdAt", "email", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");
CREATE INDEX "User_name_idx" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "HobbySessionStorageObject_hobbySessionId_idx" ON "HobbySessionStorageObject"("hobbySessionId");

-- CreateIndex
CREATE UNIQUE INDEX "StorageObject_objectKey_key" ON "StorageObject"("objectKey");

-- CreateIndex
CREATE INDEX "StorageObject_uploadedByUserId_bucket_idx" ON "StorageObject"("uploadedByUserId", "bucket");

-- CreateIndex
CREATE INDEX "StorageObject_createdAt_idx" ON "StorageObject"("createdAt" DESC);

