/*
 Warnings:

 - You are about to drop the column `counter` on the `GuildCounter` table. All the data in the column will be lost.
 - You are about to drop the column `word` on the `GuildCounter` table. All the data in the column will be lost.
 - Added the required column `triggerWord` to the `GuildCounter` table without a default value. This is not possible if the table is not empty.
 */
-- RedefineTables

PRAGMA foreign_keys = OFF;

CREATE TABLE "new_GuildCounter" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "triggerWord" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GuildCounter_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_GuildCounter" ("channelId", "guildId")
SELECT
    "channelId",
    "guildId"
FROM
    "GuildCounter";

DROP TABLE "GuildCounter";

ALTER TABLE "new_GuildCounter" RENAME TO "GuildCounter";

CREATE UNIQUE INDEX "GuildCounter_guildId_channelId_key" ON "GuildCounter" ("guildId", "channelId");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;
