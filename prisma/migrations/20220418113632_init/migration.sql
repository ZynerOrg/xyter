/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `guildmember` DROP FOREIGN KEY `GuildMember_userId_fkey`;

-- AlterTable
ALTER TABLE `guildmember` ADD COLUMN `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    ADD COLUMN `reputation` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `user`;
