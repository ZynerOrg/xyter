/*
 Warnings:

 - Added the required column `updatedAt` to the `Guild` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `Cooldown` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `GuildCounter` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `GuildMember` table without a default value. This is not possible if the table is not empty.
 */
-- RedefineTables

PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "creditsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "creditsRate" INTEGER NOT NULL DEFAULT 1,
    "creditsTimeout" INTEGER NOT NULL DEFAULT 5,
    "creditsWorkRate" INTEGER NOT NULL DEFAULT 25,
    "creditsWorkTimeout" INTEGER NOT NULL DEFAULT 86400,
    "creditsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "pointsRate" INTEGER NOT NULL DEFAULT 1,
    "pointsTimeout" INTEGER NOT NULL DEFAULT 5,
    "pointsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "reputationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "countersEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Guild" ("countersEnabled", "creditsEnabled", "creditsMinimumLength", "creditsRate", "creditsTimeout", "creditsWorkRate", "creditsWorkTimeout", "id", "pointsEnabled", "pointsMinimumLength", "pointsRate", "pointsTimeout", "reputationsEnabled")
SELECT
    "countersEnabled",
    "creditsEnabled",
    "creditsMinimumLength",
    "creditsRate",
    "creditsTimeout",
    "creditsWorkRate",
    "creditsWorkTimeout",
    "id",
    "pointsEnabled",
    "pointsMinimumLength",
    "pointsRate",
    "pointsTimeout",
    "reputationsEnabled"
FROM
    "Guild";

DROP TABLE "Guild";

ALTER TABLE "new_Guild" RENAME TO "Guild";

CREATE UNIQUE INDEX "Guild_id_key" ON "Guild" ("id");

CREATE TABLE "new_Cooldown" (
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "timeoutId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cooldown_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cooldown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Cooldown" ("cooldown", "guildId", "timeoutId", "userId")
SELECT
    "cooldown",
    "guildId",
    "timeoutId",
    "userId"
FROM
    "Cooldown";

DROP TABLE "Cooldown";

ALTER TABLE "new_Cooldown" RENAME TO "Cooldown";

CREATE UNIQUE INDEX "Cooldown_guildId_userId_timeoutId_key" ON "Cooldown" ("guildId", "userId", "timeoutId");

CREATE TABLE "new_GuildCounter" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "triggerWord" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildCounter_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_GuildCounter" ("channelId", "count", "guildId", "triggerWord")
SELECT
    "channelId",
    "count",
    "guildId",
    "triggerWord"
FROM
    "GuildCounter";

DROP TABLE "GuildCounter";

ALTER TABLE "new_GuildCounter" RENAME TO "GuildCounter";

CREATE UNIQUE INDEX "GuildCounter_guildId_channelId_key" ON "GuildCounter" ("guildId", "channelId");

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "reputationsEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_User" ("id", "reputationsEarned")
SELECT
    "id",
    "reputationsEarned"
FROM
    "User";

DROP TABLE "User";

ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_id_key" ON "User" ("id");

CREATE TABLE "new_GuildMember" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "creditsEarned" INTEGER NOT NULL DEFAULT 0,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_GuildMember" ("creditsEarned", "guildId", "pointsEarned", "userId")
SELECT
    "creditsEarned",
    "guildId",
    "pointsEarned",
    "userId"
FROM
    "GuildMember";

DROP TABLE "GuildMember";

ALTER TABLE "new_GuildMember" RENAME TO "GuildMember";

CREATE UNIQUE INDEX "GuildMember_userId_guildId_key" ON "GuildMember" ("userId", "guildId");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;

