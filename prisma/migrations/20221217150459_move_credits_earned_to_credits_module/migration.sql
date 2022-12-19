-- AlterTable

ALTER TABLE `GuildMemberCredits` ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0;

-- InsertInto

INSERT INTO GuildMemberCredits (balance, userId, guildId)
SELECT creditsEarned,
       userId,
       guildId
FROM GuildMember;

-- DropColumn

ALTER TABLE GuildMember
DROP COLUMN creditsEarned;