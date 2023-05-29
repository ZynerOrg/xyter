/*
  Warnings:

  - You are about to drop the column `minimumLength` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `timeout` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `workRate` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `workTimeout` on the `GuildCreditsSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildCreditsSettings` DROP FOREIGN KEY `GuildCreditsSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMemberCredit` DROP FOREIGN KEY `GuildMemberCredit_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildCreditsSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserReputation` DROP FOREIGN KEY `UserReputation_id_fkey`;

-- AlterTable
ALTER TABLE `GuildCreditsSettings` DROP COLUMN `minimumLength`,
    DROP COLUMN `rate`,
    DROP COLUMN `status`,
    DROP COLUMN `timeout`,
    DROP COLUMN `workRate`,
    DROP COLUMN `workTimeout`;

-- CreateIndex
CREATE INDEX `GuildMemberCredit_guildId_idx` ON `GuildMemberCredit`(`guildId`);

-- CreateIndex
CREATE INDEX `GuildMemberCredit_userId_idx` ON `GuildMemberCredit`(`userId`);

-- CreateIndex
CREATE INDEX `GuildMemberCredit_guildId_userId_idx` ON `GuildMemberCredit`(`guildId`, `userId`);

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMemberCredit` ADD CONSTRAINT `GuildMemberCredit_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReputation` ADD CONSTRAINT `UserReputation_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildCreditsSettingsId_fkey` FOREIGN KEY (`guildCreditsSettingsId`) REFERENCES `GuildCreditsSettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCreditsSettings` ADD CONSTRAINT `GuildCreditsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;
