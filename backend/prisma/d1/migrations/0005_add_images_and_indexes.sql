-- CreateTable
CREATE TABLE "StoredObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectKey" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL,
    "etag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "uploadedByUserId" TEXT,
    CONSTRAINT "StoredObject_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HobbySessionImage" (
    "hobbySessionId" TEXT NOT NULL,
    "storedObjectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("hobbySessionId", "storedObjectId"),
    CONSTRAINT "HobbySessionImage_hobbySessionId_fkey" FOREIGN KEY ("hobbySessionId") REFERENCES "HobbySession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HobbySessionImage_storedObjectId_fkey" FOREIGN KEY ("storedObjectId") REFERENCES "StoredObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAvatar" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "storedObjectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserAvatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAvatar_storedObjectId_fkey" FOREIGN KEY ("storedObjectId") REFERENCES "StoredObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HobbySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hobbyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "HobbySession_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HobbySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HobbySession" ("createdAt", "endTime", "hobbyId", "id", "notes", "startTime", "updatedAt", "userId") SELECT "createdAt", "endTime", "hobbyId", "id", "notes", "startTime", "updatedAt", "userId" FROM "HobbySession";
DROP TABLE "HobbySession";
ALTER TABLE "new_HobbySession" RENAME TO "HobbySession";
CREATE INDEX "HobbySession_userId_hobbyId_createdAt_idx" ON "HobbySession"("userId", "hobbyId", "createdAt" DESC);
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StoredObject_objectKey_key" ON "StoredObject"("objectKey");

-- CreateIndex
CREATE INDEX "StoredObject_uploadedByUserId_bucket_idx" ON "StoredObject"("uploadedByUserId", "bucket");

-- CreateIndex
CREATE INDEX "StoredObject_createdAt_idx" ON "StoredObject"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "HobbySessionImage_createdAt_idx" ON "HobbySessionImage"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatar_storedObjectId_key" ON "UserAvatar"("storedObjectId");

-- CreateIndex
CREATE INDEX "Hobby_name_idx" ON "Hobby"("name");

-- CreateIndex
CREATE INDEX "User_email_name_idx" ON "User"("email", "name");

