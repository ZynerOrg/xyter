-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_GuildMember" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    CONSTRAINT "GuildMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_GuildMember" ("guildId", "userId")
SELECT
    "guildId",
    "userId"
FROM
    "GuildMember";

DROP TABLE "GuildMember";

ALTER TABLE "new_GuildMember" RENAME TO "GuildMember";

CREATE UNIQUE INDEX "GuildMember_userId_guildId_key" ON "GuildMember" ("userId", "guildId");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;
