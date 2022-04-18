/*
 Warnings:

 - The primary key for the `module` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `module` table. All the data in the column will be lost.
 */
-- AlterTable

ALTER TABLE `module` DROP PRIMARY KEY, DROP COLUMN `id`,
    ADD PRIMARY KEY (`guildId`, `name`);
