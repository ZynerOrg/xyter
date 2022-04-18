/*
 Warnings:

 - You are about to drop the column `type` on the `module` table. All the data in the column will be lost.
 */
-- AlterTable

ALTER TABLE `module` DROP COLUMN `type`, MODIFY `enabled` BOOLEAN NOT NULL DEFAULT FALSE;

