/*
  Warnings:

  - A unique constraint covering the columns `[leaderboardId,resultId]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LeaderboardEntry_resultId_key";

-- DropIndex
DROP INDEX "LeaderboardEntry_resultId_leaderboardId_key";

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_leaderboardId_resultId_key" ON "LeaderboardEntry"("leaderboardId", "resultId");
