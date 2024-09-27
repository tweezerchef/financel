/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GuestPlay" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Result_guestId_date_idx" ON "Result"("guestId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_date_key" ON "Result"("userId", "date");
