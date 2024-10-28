/*
  Warnings:

  - A unique constraint covering the columns `[type,category,startDate]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaderboardCategory" AS ENUM ('INTEREST_RATE', 'CURRENCY', 'STOCK', 'FINAL');

-- DropIndex
DROP INDEX "Leaderboard_type_startDate_idx";

-- DropIndex
DROP INDEX "Leaderboard_type_startDate_key";

-- AlterTable
ALTER TABLE "Leaderboard" ADD COLUMN     "category" "LeaderboardCategory" NOT NULL;

-- CreateIndex
CREATE INDEX "Leaderboard_type_category_startDate_idx" ON "Leaderboard"("type", "category", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_type_category_startDate_key" ON "Leaderboard"("type", "category", "startDate");
