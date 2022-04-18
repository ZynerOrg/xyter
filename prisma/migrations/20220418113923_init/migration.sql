-- DropIndex
DROP INDEX `GuildMember_userId_fkey` ON `guildmember`;

-- AlterTable

ALTER TABLE `guildmember`
    ADD COLUMN `credits` INTEGER NULL DEFAULT 0;

