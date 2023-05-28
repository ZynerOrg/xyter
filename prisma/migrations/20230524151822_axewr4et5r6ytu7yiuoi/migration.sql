-- AlterTable
ALTER TABLE `GuildCreditsSettings` ADD COLUMN `dailyBonusAmount` INTEGER NOT NULL DEFAULT 25,
    ADD COLUMN `monthlyBonusAmount` INTEGER NOT NULL DEFAULT 150,
    ADD COLUMN `weeklyBonusAmount` INTEGER NOT NULL DEFAULT 50;
