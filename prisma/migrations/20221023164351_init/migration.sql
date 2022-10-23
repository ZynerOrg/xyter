-- CreateTable
CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    `embedColorSuccess` VARCHAR(191) NOT NULL DEFAULT '#22bb33',
    `embedColorWait` VARCHAR(191) NOT NULL DEFAULT '#f0ad4e',
    `embedColorError` VARCHAR(191) NOT NULL DEFAULT '#bb2124',
    `embedFooterText` VARCHAR(191) NOT NULL DEFAULT 'https://github.com/ZynerOrg/xyter',
    `embedFooterIcon` VARCHAR(191) NOT NULL DEFAULT 'https://github.com/ZynerOrg.png',
    `creditsEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `creditsRate` INTEGER NOT NULL DEFAULT 1,
    `creditsTimeout` INTEGER NOT NULL DEFAULT 5,
    `creditsWorkRate` INTEGER NOT NULL DEFAULT 25,
    `creditsWorkTimeout` INTEGER NOT NULL DEFAULT 86400,
    `creditsMinimumLength` INTEGER NOT NULL DEFAULT 5,
    `pointsEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `pointsRate` INTEGER NOT NULL DEFAULT 1,
    `pointsTimeout` INTEGER NOT NULL DEFAULT 5,
    `pointsMinimumLength` INTEGER NOT NULL DEFAULT 5,
    `reputationsEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `countersEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `apiCpggUrlIv` VARCHAR(191) NULL,
    `apiCpggUrlContent` VARCHAR(191) NULL,
    `apiCpggTokenIv` VARCHAR(191) NULL,
    `apiCpggTokenContent` VARCHAR(191) NULL,
    `auditsEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `auditsChannelId` VARCHAR(191) NULL,
    `shopRolesEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `shopRolesPricePerHour` INTEGER NOT NULL DEFAULT 5,
    `welcomeEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `welcomeJoinChannelId` VARCHAR(191) NULL,
    `welcomeJoinChannelMessage` VARCHAR(191) NULL,
    `welcomeLeaveChannelId` VARCHAR(191) NULL,
    `welcomeLeaveChannelMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `Guild_id_key` (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `reputationsEarned` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `User_id_key` (`id`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `GuildMember` (
    `userId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `creditsEarned` INTEGER NOT NULL DEFAULT 0,
    `pointsEarned` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `GuildMember_userId_guildId_key` (`userId`, `guildId`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `GuildCounter` (
    `guildId` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `triggerWord` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `GuildCounter_guildId_channelId_key` (`guildId`, `channelId`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `Cooldown` (
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cooldown` INTEGER NOT NULL,
    `timeoutId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `Cooldown_guildId_userId_timeoutId_key` (`guildId`, `userId`, `timeoutId`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable

CREATE TABLE `GuildShopRoles` (
    `guildId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pricePerHour` INTEGER NOT NULL DEFAULT 5,
    `lastPayed` DATETIME (3) NOT NULL,
    `createdAt` DATETIME (3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME (3) NOT NULL,
    UNIQUE INDEX `GuildShopRoles_guildId_userId_roleId_key` (`guildId`, `userId`, `roleId`))
DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey

ALTER TABLE `GuildMember`
    ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildMember`
    ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildCounter`
    ADD CONSTRAINT `GuildCounter_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `Cooldown`
    ADD CONSTRAINT `Cooldown_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `Cooldown`
    ADD CONSTRAINT `Cooldown_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildShopRoles`
    ADD CONSTRAINT `GuildShopRoles_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildShopRoles`
    ADD CONSTRAINT `GuildShopRoles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE `GuildShopRoles`
    ADD CONSTRAINT `GuildShopRoles_userId_guildId_fkey` FOREIGN KEY (`userId`, `guildId`) REFERENCES `GuildMember` (`userId`, `guildId`) ON DELETE RESTRICT ON
    UPDATE
        CASCADE;
