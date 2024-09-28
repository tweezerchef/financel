/*
  Warnings:

  - A unique constraint covering the columns `[challengeDate]` on the table `DailyChallenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DailyChallenge" ALTER COLUMN "challengeDate" DROP DEFAULT,
ALTER COLUMN "challengeDate" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_challengeDate_key" ON "DailyChallenge"("challengeDate");

-- CreateIndex
CREATE INDEX "DailyChallenge_challengeDate_idx" ON "DailyChallenge"("challengeDate");
