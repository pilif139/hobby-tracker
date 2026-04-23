-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HobbySessionImage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_HobbySessionToStoredObject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_HobbySessionToStoredObject_A_fkey" FOREIGN KEY ("A") REFERENCES "HobbySession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HobbySessionToStoredObject_B_fkey" FOREIGN KEY ("B") REFERENCES "StoredObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_HobbySessionToStoredObject_AB_unique" ON "_HobbySessionToStoredObject"("A", "B");

-- CreateIndex
CREATE INDEX "_HobbySessionToStoredObject_B_index" ON "_HobbySessionToStoredObject"("B");

