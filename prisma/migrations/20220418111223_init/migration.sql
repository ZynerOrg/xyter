/*
 Warnings:

 - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
 - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
 - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
 */
-- DropForeignKey

ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey

ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropIndex

DROP INDEX `User_email_key` ON `user`;

-- AlterTable

ALTER TABLE `user` DROP PRIMARY KEY, DROP COLUMN `email`, DROP COLUMN `name`, MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable

DROP TABLE `post`;

-- DropTable

DROP TABLE `profile`;

-- CreateTable

CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `GuildMember` (
    `id` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `Module` (
    `id` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

