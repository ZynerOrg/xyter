/*
 Warnings:

 - The primary key for the `guildmember` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `guildmember` table. All the data in the column will be lost.
 - Added the required column `guildId` to the `GuildMember` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `GuildMember` table without a default value. This is not possible if the table is not empty.
 */
-- AlterTable

ALTER TABLE `guildmember` DROP PRIMARY KEY, DROP COLUMN `id`,
    ADD COLUMN `guildId` VARCHAR(191) NOT NULL,
        ADD COLUMN `userId` VARCHAR(191) NOT NULL,
            ADD PRIMARY KEY (`guildId`, `userId`);

-- AlterTable

ALTER TABLE `user`
    ADD COLUMN `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
            ADD COLUMN `reputation` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey

ALTER TABLE `GuildMember`
    ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildMember`
    ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

