/*
  Warnings:

  - Added the required column `score` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN     "score" DECIMAL(10,2) NOT NULL;
