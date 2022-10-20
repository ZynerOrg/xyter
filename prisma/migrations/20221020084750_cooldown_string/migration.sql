-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cooldown" (
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cooldown" TEXT NOT NULL,
    "timeoutId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cooldown_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cooldown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cooldown" ("cooldown", "createdAt", "guildId", "timeoutId", "updatedAt", "userId") SELECT "cooldown", "createdAt", "guildId", "timeoutId", "updatedAt", "userId" FROM "Cooldown";
DROP TABLE "Cooldown";
ALTER TABLE "new_Cooldown" RENAME TO "Cooldown";
CREATE UNIQUE INDEX "Cooldown_guildId_userId_timeoutId_key" ON "Cooldown"("guildId", "userId", "timeoutId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
