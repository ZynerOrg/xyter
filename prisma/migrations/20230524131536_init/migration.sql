-- CreateTable
CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Guild_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMember` (
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GuildMember_guildId_userId_key`(`guildId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMemberCredit` (
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `balance` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `GuildMemberCredit_guildId_userId_key`(`guildId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserReputation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `negative` INTEGER NOT NULL DEFAULT 0,
    `positive` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `UserReputation_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildCreditsSettingsId` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildCreditsSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `workBonusChance` INTEGER NOT NULL DEFAULT 30,
    `workPenaltyChance` INTEGER NOT NULL DEFAULT 10,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NOT NULL DEFAULT 1,
    `timeout` INTEGER NOT NULL DEFAULT 5,
    `workRate` INTEGER NOT NULL DEFAULT 25,
    `workTimeout` INTEGER NOT NULL DEFAULT 86400,
    `minimumLength` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildCreditsSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiCredentials` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `apiName` VARCHAR(191) NOT NULL,
    `credentials` JSON NOT NULL,

    UNIQUE INDEX `ApiCredentials_guildId_apiName_key`(`guildId`, `apiName`),
    UNIQUE INDEX `ApiCredentials_userId_apiName_key`(`userId`, `apiName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cooldown` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cooldownItem` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `guildId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `cooldownItem_guildId_idx`(`cooldownItem`, `guildId`),
    INDEX `cooldownItem_userId_idx`(`cooldownItem`, `userId`),
    INDEX `cooldownItem_guildId_userId_idx`(`cooldownItem`, `guildId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImportOldData` (
    `id` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `beforeMessageId` VARCHAR(191) NULL,

    UNIQUE INDEX `ImportOldData_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMemberCredit` ADD CONSTRAINT `GuildMemberCredit_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReputation` ADD CONSTRAINT `UserReputation_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildCreditsSettingsId_fkey` FOREIGN KEY (`guildCreditsSettingsId`) REFERENCES `GuildCreditsSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCreditsSettings` ADD CONSTRAINT `GuildCreditsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE SET NULL ON UPDATE CASCADE;
