/*
  Warnings:

  - You are about to alter the column `reputationsEarned` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `count` on the `GuildCounter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsEarned` on the `GuildMember` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pointsEarned` on the `GuildMember` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pricePerHour` on the `GuildShopRoles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsMinimumLength` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsRate` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsTimeout` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsWorkRate` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `creditsWorkTimeout` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pointsMinimumLength` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pointsRate` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pointsTimeout` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `shopRolesPricePerHour` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `cooldown` on the `Cooldown` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "reputationsEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "reputationsEarned", "updatedAt") SELECT "createdAt", "id", "reputationsEarned", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE TABLE "new_GuildCounter" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "triggerWord" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildCounter_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuildCounter" ("channelId", "count", "createdAt", "guildId", "triggerWord", "updatedAt") SELECT "channelId", "count", "createdAt", "guildId", "triggerWord", "updatedAt" FROM "GuildCounter";
DROP TABLE "GuildCounter";
ALTER TABLE "new_GuildCounter" RENAME TO "GuildCounter";
CREATE UNIQUE INDEX "GuildCounter_guildId_channelId_key" ON "GuildCounter"("guildId", "channelId");
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
INSERT INTO "new_GuildMember" ("createdAt", "creditsEarned", "guildId", "pointsEarned", "updatedAt", "userId") SELECT "createdAt", "creditsEarned", "guildId", "pointsEarned", "updatedAt", "userId" FROM "GuildMember";
DROP TABLE "GuildMember";
ALTER TABLE "new_GuildMember" RENAME TO "GuildMember";
CREATE UNIQUE INDEX "GuildMember_userId_guildId_key" ON "GuildMember"("userId", "guildId");
CREATE TABLE "new_GuildShopRoles" (
    "guildId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL DEFAULT 5,
    "lastPayed" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildShopRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuildShopRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuildShopRoles_userId_guildId_fkey" FOREIGN KEY ("userId", "guildId") REFERENCES "GuildMember" ("userId", "guildId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuildShopRoles" ("createdAt", "guildId", "lastPayed", "pricePerHour", "roleId", "updatedAt", "userId") SELECT "createdAt", "guildId", "lastPayed", "pricePerHour", "roleId", "updatedAt", "userId" FROM "GuildShopRoles";
DROP TABLE "GuildShopRoles";
ALTER TABLE "new_GuildShopRoles" RENAME TO "GuildShopRoles";
CREATE UNIQUE INDEX "GuildShopRoles_guildId_userId_roleId_key" ON "GuildShopRoles"("guildId", "userId", "roleId");
CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "embedColorSuccess" TEXT NOT NULL DEFAULT '#22bb33',
    "embedColorWait" TEXT NOT NULL DEFAULT '#f0ad4e',
    "embedColorError" TEXT NOT NULL DEFAULT '#bb2124',
    "embedFooterText" TEXT NOT NULL DEFAULT 'https://github.com/ZynerOrg/xyter',
    "embedFooterIcon" TEXT NOT NULL DEFAULT 'https://github.com/ZynerOrg.png',
    "creditsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "creditsRate" INTEGER NOT NULL DEFAULT 1,
    "creditsTimeout" INTEGER NOT NULL DEFAULT 5,
    "creditsWorkRate" INTEGER NOT NULL DEFAULT 25,
    "creditsWorkTimeout" INTEGER NOT NULL DEFAULT 86400,
    "creditsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pointsRate" INTEGER NOT NULL DEFAULT 1,
    "pointsTimeout" INTEGER NOT NULL DEFAULT 5,
    "pointsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "reputationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "countersEnabled" BOOLEAN NOT NULL DEFAULT false,
    "apiCpggUrlIv" TEXT,
    "apiCpggUrlContent" TEXT,
    "apiCpggTokenIv" TEXT,
    "apiCpggTokenContent" TEXT,
    "auditsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "auditsChannelId" TEXT,
    "shopRolesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "shopRolesPricePerHour" INTEGER NOT NULL DEFAULT 5,
    "welcomeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "welcomeJoinChannelId" TEXT,
    "welcomeJoinChannelMessage" TEXT,
    "welcomeLeaveChannelId" TEXT,
    "welcomeLeaveChannelMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Guild" ("apiCpggTokenContent", "apiCpggTokenIv", "apiCpggUrlContent", "apiCpggUrlIv", "auditsChannelId", "auditsEnabled", "countersEnabled", "createdAt", "creditsEnabled", "creditsMinimumLength", "creditsRate", "creditsTimeout", "creditsWorkRate", "creditsWorkTimeout", "embedColorError", "embedColorSuccess", "embedColorWait", "embedFooterIcon", "embedFooterText", "id", "pointsEnabled", "pointsMinimumLength", "pointsRate", "pointsTimeout", "reputationsEnabled", "shopRolesEnabled", "shopRolesPricePerHour", "updatedAt", "welcomeEnabled", "welcomeJoinChannelId", "welcomeJoinChannelMessage", "welcomeLeaveChannelId", "welcomeLeaveChannelMessage") SELECT "apiCpggTokenContent", "apiCpggTokenIv", "apiCpggUrlContent", "apiCpggUrlIv", "auditsChannelId", "auditsEnabled", "countersEnabled", "createdAt", "creditsEnabled", "creditsMinimumLength", "creditsRate", "creditsTimeout", "creditsWorkRate", "creditsWorkTimeout", "embedColorError", "embedColorSuccess", "embedColorWait", "embedFooterIcon", "embedFooterText", "id", "pointsEnabled", "pointsMinimumLength", "pointsRate", "pointsTimeout", "reputationsEnabled", "shopRolesEnabled", "shopRolesPricePerHour", "updatedAt", "welcomeEnabled", "welcomeJoinChannelId", "welcomeJoinChannelMessage", "welcomeLeaveChannelId", "welcomeLeaveChannelMessage" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");
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
INSERT INTO "new_Cooldown" ("cooldown", "createdAt", "guildId", "timeoutId", "updatedAt", "userId") SELECT "cooldown", "createdAt", "guildId", "timeoutId", "updatedAt", "userId" FROM "Cooldown";
DROP TABLE "Cooldown";
ALTER TABLE "new_Cooldown" RENAME TO "Cooldown";
CREATE UNIQUE INDEX "Cooldown_guildId_userId_timeoutId_key" ON "Cooldown"("guildId", "userId", "timeoutId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
