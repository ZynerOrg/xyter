/*
  Warnings:

  - You are about to drop the column `statis` on the `GuildConfigWelcome` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GuildConfigWelcome` DROP COLUMN `statis`,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;
