-- CreateTable
CREATE TABLE `GuildMemberCredits` (
    `userId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildMemberCredits_userId_guildId_key`(`userId`, `guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildMemberCredits` ADD CONSTRAINT `GuildMemberCredits_userId_guildId_fkey` FOREIGN KEY (`userId`, `guildId`) REFERENCES `GuildMember`(`userId`, `guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
