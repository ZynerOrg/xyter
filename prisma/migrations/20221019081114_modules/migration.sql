-- AlterTable
ALTER TABLE "GuildMember"
    ADD COLUMN "creditsEarned" INTEGER;

ALTER TABLE "GuildMember"
    ADD COLUMN "pointsEarned" INTEGER;

-- CreateTable

CREATE TABLE "GuildCounter" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GuildCounter_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables

PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "creditsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "creditsRate" INTEGER NOT NULL DEFAULT 1,
    "creditsTimeout" INTEGER NOT NULL DEFAULT 5,
    "creditsWorkRate" INTEGER NOT NULL DEFAULT 25,
    "creditsWorkTimeout" INTEGER NOT NULL DEFAULT 86400,
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "pointsRate" INTEGER NOT NULL DEFAULT 1,
    "pointsTimeout" INTEGER NOT NULL DEFAULT 5,
    "reputationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "countersEnabled" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO "new_Guild" ("id")
SELECT
    "id"
FROM
    "Guild";

DROP TABLE "Guild";

ALTER TABLE "new_Guild" RENAME TO "Guild";

CREATE UNIQUE INDEX "Guild_id_key" ON "Guild" ("id");

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "reputationsEarned" INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "new_User" ("id")
SELECT
    "id"
FROM
    "User";

DROP TABLE "User";

ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_id_key" ON "User" ("id");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;

-- CreateIndex

CREATE UNIQUE INDEX "GuildCounter_guildId_channelId_key" ON "GuildCounter" ("guildId", "channelId");

