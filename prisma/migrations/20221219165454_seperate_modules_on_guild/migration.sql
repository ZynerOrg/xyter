/*
  Warnings:

  - You are about to drop the column `apiCpggTokenContent` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `apiCpggTokenIv` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `apiCpggUrlContent` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `apiCpggUrlIv` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `auditsChannelId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `auditsEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `countersEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsMinimumLength` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsRate` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsTimeout` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsWorkRate` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `creditsWorkTimeout` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `embedColorError` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `embedColorSuccess` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `embedColorWait` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `embedFooterIcon` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `embedFooterText` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `pointsEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `pointsMinimumLength` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `pointsRate` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `pointsTimeout` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `reputationsEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `shopRolesEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `shopRolesPricePerHour` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeEnabled` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeJoinChannelId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeJoinChannelMessage` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeLeaveChannelId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeLeaveChannelMessage` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the `GuildCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GuildCounter` DROP FOREIGN KEY `GuildCounter_guildId_fkey`;

-- AlterTable
ALTER TABLE `Guild` DROP COLUMN `apiCpggTokenContent`,
    DROP COLUMN `apiCpggTokenIv`,
    DROP COLUMN `apiCpggUrlContent`,
    DROP COLUMN `apiCpggUrlIv`,
    DROP COLUMN `auditsChannelId`,
    DROP COLUMN `auditsEnabled`,
    DROP COLUMN `countersEnabled`,
    DROP COLUMN `creditsEnabled`,
    DROP COLUMN `creditsMinimumLength`,
    DROP COLUMN `creditsRate`,
    DROP COLUMN `creditsTimeout`,
    DROP COLUMN `creditsWorkRate`,
    DROP COLUMN `creditsWorkTimeout`,
    DROP COLUMN `embedColorError`,
    DROP COLUMN `embedColorSuccess`,
    DROP COLUMN `embedColorWait`,
    DROP COLUMN `embedFooterIcon`,
    DROP COLUMN `embedFooterText`,
    DROP COLUMN `pointsEnabled`,
    DROP COLUMN `pointsMinimumLength`,
    DROP COLUMN `pointsRate`,
    DROP COLUMN `pointsTimeout`,
    DROP COLUMN `reputationsEnabled`,
    DROP COLUMN `shopRolesEnabled`,
    DROP COLUMN `shopRolesPricePerHour`,
    DROP COLUMN `welcomeEnabled`,
    DROP COLUMN `welcomeJoinChannelId`,
    DROP COLUMN `welcomeJoinChannelMessage`,
    DROP COLUMN `welcomeLeaveChannelId`,
    DROP COLUMN `welcomeLeaveChannelMessage`;

-- DropTable
DROP TABLE `GuildCounter`;

-- CreateTable
CREATE TABLE `GuildConfigEmbeds` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `successColor` VARCHAR(191) NOT NULL DEFAULT '#22bb33',
    `waitColor` VARCHAR(191) NOT NULL DEFAULT '#f0ad4e',
    `errorColor` VARCHAR(191) NOT NULL DEFAULT '#bb2124',
    `footerText` VARCHAR(191) NOT NULL DEFAULT 'https://github.com/ZynerOrg/xyter',
    `footerIcon` VARCHAR(191) NOT NULL DEFAULT 'https://github.com/ZynerOrg.png',

    UNIQUE INDEX `GuildConfigEmbeds_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigCredits` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NOT NULL DEFAULT 1,
    `timeout` INTEGER NOT NULL DEFAULT 5,
    `workRate` INTEGER NOT NULL DEFAULT 25,
    `workTimeout` INTEGER NOT NULL DEFAULT 86400,
    `minimumLength` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildConfigCredits_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigPoints` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NOT NULL DEFAULT 1,
    `timeout` INTEGER NOT NULL DEFAULT 5,
    `minimumLength` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildConfigPoints_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigReputation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GuildConfigReputation_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigCounters` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GuildConfigCounters_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigApis` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildConfigApisCpggId` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildConfigApis_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigApisCpgg` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `urlIv` VARCHAR(191) NULL,
    `urlContent` VARCHAR(191) NULL,
    `tokenIv` VARCHAR(191) NULL,
    `tokenContent` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildConfigApisCpgg_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigAudits` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `channelId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildConfigAudits_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigShop` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `guildConfigShopRolesId` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildConfigShop_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigShopRoles` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `pricePerHour` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildConfigShopRoles_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildConfigWelcome` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `statis` BOOLEAN NOT NULL DEFAULT false,
    `joinChannelId` VARCHAR(191) NULL,
    `joinChannelMessage` VARCHAR(191) NULL,
    `leaveChannelId` VARCHAR(191) NULL,
    `leaveChannelMessage` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildConfigWelcome_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildCounters` (
    `guildId` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `triggerWord` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GuildCounters_guildId_channelId_key`(`guildId`, `channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildConfigEmbeds` ADD CONSTRAINT `GuildConfigEmbeds_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigCredits` ADD CONSTRAINT `GuildConfigCredits_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigPoints` ADD CONSTRAINT `GuildConfigPoints_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigReputation` ADD CONSTRAINT `GuildConfigReputation_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigCounters` ADD CONSTRAINT `GuildConfigCounters_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigApis` ADD CONSTRAINT `GuildConfigApis_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigApis` ADD CONSTRAINT `GuildConfigApis_guildConfigApisCpggId_fkey` FOREIGN KEY (`guildConfigApisCpggId`) REFERENCES `GuildConfigApisCpgg`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigApisCpgg` ADD CONSTRAINT `GuildConfigApisCpgg_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigAudits` ADD CONSTRAINT `GuildConfigAudits_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigShop` ADD CONSTRAINT `GuildConfigShop_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigShop` ADD CONSTRAINT `GuildConfigShop_guildConfigShopRolesId_fkey` FOREIGN KEY (`guildConfigShopRolesId`) REFERENCES `GuildConfigShopRoles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigShopRoles` ADD CONSTRAINT `GuildConfigShopRoles_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfigWelcome` ADD CONSTRAINT `GuildConfigWelcome_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCounters` ADD CONSTRAINT `GuildCounters_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
