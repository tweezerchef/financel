/*
  Warnings:

  - You are about to drop the column `attempted` on the `Guest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "attempted",
ADD COLUMN     "lastPlay" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "GuestPlay" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestPlay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestPlay_guestId_playedAt_key" ON "GuestPlay"("guestId", "playedAt");

-- AddForeignKey
ALTER TABLE "GuestPlay" ADD CONSTRAINT "GuestPlay_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
