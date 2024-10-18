-- CreateEnum
CREATE TYPE "LeaderboardType" AS ENUM ('TODAY', 'YESTERDAY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "type" "LeaderboardType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "leaderboardId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Leaderboard_type_startDate_endDate_idx" ON "Leaderboard"("type", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_type_startDate_endDate_key" ON "Leaderboard"("type", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_resultId_key" ON "LeaderboardEntry"("resultId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_leaderboardId_rank_idx" ON "LeaderboardEntry"("leaderboardId", "rank");

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "Leaderboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
