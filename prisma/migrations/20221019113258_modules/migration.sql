-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "creditsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "creditsRate" INTEGER NOT NULL DEFAULT 1,
    "creditsTimeout" INTEGER NOT NULL DEFAULT 5,
    "creditsWorkRate" INTEGER NOT NULL DEFAULT 25,
    "creditsWorkTimeout" INTEGER NOT NULL DEFAULT 86400,
    "creditsMinimumLength" INTEGER NOT NULL DEFAULT 5,
    "pointsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "pointsRate" INTEGER NOT NULL DEFAULT 1,
    "pointsTimeout" INTEGER NOT NULL DEFAULT 5,
    "reputationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "countersEnabled" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO "new_Guild" ("countersEnabled", "creditsEnabled", "creditsRate", "creditsTimeout", "creditsWorkRate", "creditsWorkTimeout", "id", "pointsEnabled", "pointsRate", "pointsTimeout", "reputationsEnabled")
SELECT
    "countersEnabled",
    "creditsEnabled",
    "creditsRate",
    "creditsTimeout",
    "creditsWorkRate",
    "creditsWorkTimeout",
    "id",
    "pointsEnabled",
    "pointsRate",
    "pointsTimeout",
    "reputationsEnabled"
FROM
    "Guild";

DROP TABLE "Guild";

ALTER TABLE "new_Guild" RENAME TO "Guild";

CREATE UNIQUE INDEX "Guild_id_key" ON "Guild" ("id");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;
