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
    `status` BOOLEAN NOT NULL DEFAULT false,
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



-- AlterTable

ALTER TABLE `GuildMemberCredits` ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0;

-- InsertInto

INSERT INTO GuildConfigApisCpgg (tokenContent,tokenIv,urlContent,urlIv,id,updatedAt)
SELECT apiCpggTokenContent,apiCpggTokenIv,apiCpggUrlContent,apiCpggUrlIv,id,updatedAt
FROM Guild
WHERE
  (
    apiCpggTokenContent IS NOT NULL
  AND
    apiCpggTokenIv IS NOT NULL
  AND
    apiCpggUrlContent IS NOT NULL
  AND
    apiCpggUrlIv IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `apiCpggTokenContent`,
    DROP COLUMN `apiCpggTokenIv`,
    DROP COLUMN `apiCpggUrlContent`,
    DROP COLUMN `apiCpggUrlIv`;

-- InsertInto

INSERT INTO GuildConfigAudits (status,channelId,id,updatedAt)
SELECT auditsEnabled,auditsChannelId,id,updatedAt
FROM Guild
WHERE
  (
    auditsEnabled IS NOT NULL
  AND
    auditsChannelId IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `auditsChannelId`,
    DROP COLUMN `auditsEnabled`;

-- InsertInto

INSERT INTO GuildConfigCounters (status,id,updatedAt)
SELECT countersEnabled,id,updatedAt
FROM Guild
WHERE
  (
    countersEnabled IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `countersEnabled`;

-- InsertInto

INSERT INTO GuildConfigCredits (status,minimumLength,rate,timeout,workRate,workTimeout,id,updatedAt)
SELECT creditsEnabled,creditsMinimumLength,creditsRate,creditsTimeout,creditsWorkRate,creditsWorkTimeout,id,updatedAt
FROM Guild
WHERE
  (
    creditsEnabled IS NOT NULL
  AND
    creditsMinimumLength IS NOT NULL
  AND
    creditsRate IS NOT NULL
  AND
    creditsTimeout IS NOT NULL
  AND
    creditsWorkRate IS NOT NULL
  AND
    creditsWorkTimeout IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `creditsEnabled`,
    DROP COLUMN `creditsMinimumLength`,
    DROP COLUMN `creditsRate`,
    DROP COLUMN `creditsTimeout`,
    DROP COLUMN `creditsWorkRate`,
    DROP COLUMN `creditsWorkTimeout`;



-- InsertInto

INSERT INTO GuildConfigEmbeds (errorColor,successColor,waitColor,footerIcon,footerText,id,updatedAt)
SELECT embedColorError,embedColorSuccess,embedColorWait,embedFooterIcon,embedFooterText,id,updatedAt
FROM Guild
WHERE
  (
    embedColorError IS NOT NULL
  AND
    embedColorSuccess IS NOT NULL
  AND
    embedColorWait IS NOT NULL
  AND
    embedFooterIcon IS NOT NULL
  AND
    embedFooterText IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `embedColorError`,
    DROP COLUMN `embedColorSuccess`,
    DROP COLUMN `embedColorWait`,
    DROP COLUMN `embedFooterIcon`,
    DROP COLUMN `embedFooterText`;


-- InsertInto

INSERT INTO GuildConfigPoints (status,minimumLength,rate,timeout,id,updatedAt)
SELECT pointsEnabled,pointsMinimumLength,pointsRate,pointsTimeout,id,updatedAt
FROM Guild
WHERE
  (
    pointsEnabled IS NOT NULL
  AND
    pointsMinimumLength IS NOT NULL
  AND
    pointsRate IS NOT NULL
  AND
    pointsTimeout IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `pointsEnabled`,
    DROP COLUMN `pointsMinimumLength`,
    DROP COLUMN `pointsRate`,
    DROP COLUMN `pointsTimeout`;


-- InsertInto

INSERT INTO GuildConfigReputation (status,id,updatedAt)
SELECT reputationsEnabled,id,updatedAt
FROM Guild
WHERE
  (
    reputationsEnabled IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `reputationsEnabled`;



-- InsertInto

INSERT INTO GuildConfigShopRoles (status,pricePerHour,id,updatedAt)
SELECT shopRolesEnabled,shopRolesPricePerHour,id,updatedAt
FROM Guild
WHERE
  (
    shopRolesEnabled IS NOT NULL
  AND
    shopRolesPricePerHour IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable

ALTER TABLE `Guild` DROP COLUMN `shopRolesEnabled`,
    DROP COLUMN `shopRolesPricePerHour`;

-- InsertInto

INSERT INTO GuildConfigWelcome (status,joinChannelId,joinChannelMessage,leaveChannelId,leaveChannelMessage,id,updatedAt)
SELECT welcomeEnabled,welcomeJoinChannelId,welcomeJoinChannelMessage,welcomeLeaveChannelId,welcomeLeaveChannelMessage,id,updatedAt
FROM Guild
WHERE
  (
    welcomeEnabled IS NOT NULL
  AND
    welcomeJoinChannelId IS NOT NULL
  AND
    welcomeJoinChannelMessage IS NOT NULL
  AND
    welcomeLeaveChannelId IS NOT NULL
  AND
    id IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- AlterTable
ALTER TABLE `Guild` DROP COLUMN `welcomeEnabled`,
    DROP COLUMN `welcomeJoinChannelId`,
    DROP COLUMN `welcomeJoinChannelMessage`,
    DROP COLUMN `welcomeLeaveChannelId`,
    DROP COLUMN `welcomeLeaveChannelMessage`;



-- InsertInto

INSERT INTO GuildCounters (guildId,channelId,triggerWord,count,updatedAt)
SELECT guildId,channelId,triggerWord,count,updatedAt
FROM GuildCounter
WHERE
  (
    guildId IS NOT NULL
  AND
    channelId IS NOT NULL
  AND
    triggerWord IS NOT NULL
  AND
    count IS NOT NULL
  AND
    updatedAt IS NOT NULL
  );

-- DropTable
DROP TABLE `GuildCounter`;

-- InsertInto

INSERT INTO GuildMemberCredits (balance,userId,guildId)
SELECT creditsEarned,userid,guildId
FROM GuildMember
WHERE
  (
    creditsEarned IS NOT NULL
  AND
    userId IS NOT NULL
  AND
    guildId IS NOT NULL
  );

-- DeleteFrom
DELETE FROM GuildMemberCredits
WHERE balance = 0;

-- AlterTable

ALTER TABLE `GuildMember` DROP COLUMN `creditsEarned`;

