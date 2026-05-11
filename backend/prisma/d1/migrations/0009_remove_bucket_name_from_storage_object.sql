-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StorageObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectKey" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL,
    "etag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "uploadedByUserId" TEXT,
    CONSTRAINT "StorageObject_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StorageObject" ("contentType", "createdAt", "etag", "id", "objectKey", "size", "updatedAt", "uploadedByUserId") SELECT "contentType", "createdAt", "etag", "id", "objectKey", "size", "updatedAt", "uploadedByUserId" FROM "StorageObject";
DROP TABLE "StorageObject";
ALTER TABLE "new_StorageObject" RENAME TO "StorageObject";
CREATE UNIQUE INDEX "StorageObject_objectKey_key" ON "StorageObject"("objectKey");
CREATE INDEX "StorageObject_uploadedByUserId_createdAt_idx" ON "StorageObject"("uploadedByUserId", "createdAt" DESC);
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

