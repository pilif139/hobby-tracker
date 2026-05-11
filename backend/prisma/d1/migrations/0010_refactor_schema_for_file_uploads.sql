-- DropIndex
DROP INDEX "HobbySessionStorageObject_hobbySessionId_idx";

-- DropIndex
DROP INDEX "StorageObject_uploadedByUserId_createdAt_idx";

-- DropIndex
DROP INDEX "StorageObject_objectKey_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HobbySessionStorageObject";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StorageObject";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "HobbySessionFile" (
    "storageObjectKey" TEXT NOT NULL PRIMARY KEY,
    "hobbySessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HobbySessionFile_hobbySessionId_fkey" FOREIGN KEY ("hobbySessionId") REFERENCES "HobbySession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "avatarFileKey" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_name_idx" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "HobbySessionFile_hobbySessionId_idx" ON "HobbySessionFile"("hobbySessionId");

