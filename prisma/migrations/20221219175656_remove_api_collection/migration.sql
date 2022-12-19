/*
  Warnings:

  - You are about to drop the `GuildConfigApis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GuildConfigApis` DROP FOREIGN KEY `GuildConfigApis_guildConfigApisCpggId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigApis` DROP FOREIGN KEY `GuildConfigApis_id_fkey`;

-- DropTable
DROP TABLE `GuildConfigApis`;
