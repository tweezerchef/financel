/*
  Warnings:

  - You are about to drop the `GuestPlay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuestPlay" DROP CONSTRAINT "GuestPlay_guestId_fkey";

-- DropTable
DROP TABLE "GuestPlay";
