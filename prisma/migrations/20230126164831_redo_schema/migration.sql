/*
  Warnings:

  - You are about to drop the column `guildConfigShopRolesId` on the `GuildConfigShop` table. All the data in the column will be lost.
  - You are about to drop the column `pointsEarned` on the `GuildMember` table. All the data in the column will be lost.
  - You are about to drop the `GuildConfigShopRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildShopRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GuildConfigShop` DROP FOREIGN KEY `GuildConfigShop_guildConfigShopRolesId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigShopRoles` DROP FOREIGN KEY `GuildConfigShopRoles_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMemberCredit` DROP FOREIGN KEY `GuildMemberCredits_userId_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildShopRoles` DROP FOREIGN KEY `GuildShopRoles_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildShopRoles` DROP FOREIGN KEY `GuildShopRoles_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildShopRoles` DROP FOREIGN KEY `GuildShopRoles_userId_guildId_fkey`;

-- AlterTable
ALTER TABLE `GuildConfigShop` DROP COLUMN `guildConfigShopRolesId`;

-- AlterTable
ALTER TABLE `GuildMember` DROP COLUMN `pointsEarned`;

-- DropTable
DROP TABLE `GuildConfigShopRoles`;

-- DropTable
DROP TABLE `GuildShopRoles`;

-- AddForeignKey
ALTER TABLE `GuildMemberCredit` ADD CONSTRAINT `GuildMemberCredit_userId_guildId_fkey` FOREIGN KEY (`userId`, `guildId`) REFERENCES `GuildMember`(`userId`, `guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `GuildMemberCredit_userId_guildId_key` ON `GuildMemberCredit`(`userId`, `guildId`);
DROP INDEX `GuildMemberCredits_userId_guildId_key` ON `GuildMemberCredit`;
