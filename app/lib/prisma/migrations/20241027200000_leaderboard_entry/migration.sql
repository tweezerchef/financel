/*
  Warnings:

  - A unique constraint covering the columns `[resultId,leaderboardId]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_resultId_leaderboardId_key" ON "LeaderboardEntry"("resultId", "leaderboardId");
