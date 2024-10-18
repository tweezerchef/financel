/*
  Warnings:

  - You are about to drop the column `percentClosest` on the `ResultCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResultCategory" DROP COLUMN "percentClosest",
ADD COLUMN     "percentClose" DECIMAL(10,2);
