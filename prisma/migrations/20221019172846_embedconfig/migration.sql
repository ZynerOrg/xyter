-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "embedColorSuccess" TEXT NOT NULL DEFAULT '#22bb33',
    "embedColorWait" TEXT NOT NULL DEFAULT '#f0ad4e',
    "embedColorError" TEXT NOT NULL DEFAULT '#bb2124',
    "embedFooterText" TEXT NOT NULL DEFAULT 'https://github.com/ZynerOrg/xyter',
    "embedFooterIcon" TEXT NOT NULL DEFAULT 'https://github.com/ZynerOrg.png',
    "creditsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "creditsRate" INTEGER NOT NULL DEFAULT 1,
    "creditsTimeout" INTEGER NOT NULL DEFAULT 5,
    "creditsWorkRate" INTEGER NOT NULL DEFAULT 25,
    "creditsWorkTimeout" INTEGER NOT NULL DEFAULT 86400,
    "creditsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "pointsRate" INTEGER NOT NULL DEFAULT 1,
    "pointsTimeout" INTEGER NOT NULL DEFAULT 5,
    "pointsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "reputationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "countersEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Guild" ("countersEnabled", "createdAt", "creditsEnabled", "creditsMinimumLength", "creditsRate", "creditsTimeout", "creditsWorkRate", "creditsWorkTimeout", "id", "pointsEnabled", "pointsMinimumLength", "pointsRate", "pointsTimeout", "reputationsEnabled", "updatedAt")
SELECT
    "countersEnabled",
    "createdAt",
    "creditsEnabled",
    "creditsMinimumLength",
    "creditsRate",
    "creditsTimeout",
    "creditsWorkRate",
    "creditsWorkTimeout",
    "id",
    "pointsEnabled",
    "pointsMinimumLength",
    "pointsRate",
    "pointsTimeout",
    "reputationsEnabled",
    "updatedAt"
FROM
    "Guild";

DROP TABLE "Guild";

ALTER TABLE "new_Guild" RENAME TO "Guild";

CREATE UNIQUE INDEX "Guild_id_key" ON "Guild" ("id");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;

