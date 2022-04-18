/*
 Warnings:

 - Added the required column `enabled` to the `Module` table without a default value. This is not possible if the table is not empty.
 - Added the required column `guildId` to the `Module` table without a default value. This is not possible if the table is not empty.
 - Added the required column `type` to the `Module` table without a default value. This is not possible if the table is not empty.
 */
-- AlterTable

ALTER TABLE `module`
    ADD COLUMN `enabled` BOOLEAN NOT NULL,
        ADD COLUMN `guildId` VARCHAR(191) NOT NULL,
                ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateTable

CREATE TABLE `Credential` (
    `id` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey

ALTER TABLE `Module`
    ADD CONSTRAINT `Module_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;
