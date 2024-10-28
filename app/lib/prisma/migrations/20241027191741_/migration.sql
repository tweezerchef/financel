/*
  Warnings:

  - A unique constraint covering the columns `[type,startDate]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Leaderboard_type_startDate_endDate_idx";

-- DropIndex
DROP INDEX "Leaderboard_type_startDate_endDate_key";

-- CreateIndex
CREATE INDEX "Leaderboard_type_startDate_idx" ON "Leaderboard"("type", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_type_startDate_key" ON "Leaderboard"("type", "startDate");
