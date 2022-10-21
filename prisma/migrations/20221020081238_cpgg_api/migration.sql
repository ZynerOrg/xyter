-- AlterTable
ALTER TABLE "Guild"
    ADD COLUMN "apiCpggTokenContent" TEXT;

ALTER TABLE "Guild"
    ADD COLUMN "apiCpggTokenIv" TEXT;

ALTER TABLE "Guild"
    ADD COLUMN "apiCpggUrlContent" TEXT;

ALTER TABLE "Guild"
    ADD COLUMN "apiCpggUrlIv" TEXT;
