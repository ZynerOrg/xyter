-- CreateTable
CREATE TABLE "Cooldown" (
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "timeoutId" TEXT NOT NULL,
    CONSTRAINT "Cooldown_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cooldown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooldown_guildId_userId_timeoutId_key" ON "Cooldown"("guildId", "userId", "timeoutId");
