/*
  Warnings:

  - The values [COMMODITY] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `catagory` on the `InterestRate` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `commodityPriceId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `currencyValueId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `dateId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `guess` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `interestRateId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `stockPriceId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `tries` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Commodity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommodityPrice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `InterestRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('STOCK', 'INTEREST_RATE', 'CURRENCY');
ALTER TABLE "ResultCategory" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CommodityPrice" DROP CONSTRAINT "CommodityPrice_commodityId_fkey";

-- DropForeignKey
ALTER TABLE "CommodityPrice" DROP CONSTRAINT "CommodityPrice_dateId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_commodityPriceId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_currencyValueId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_dateId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_interestRateId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_stockPriceId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_userId_fkey";

-- DropIndex
DROP INDEX "InterestRate_catagory_key";

-- AlterTable
ALTER TABLE "InterestRate" DROP COLUMN "catagory",
ADD COLUMN     "category" "IRCategories" NOT NULL;

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "category",
DROP COLUMN "commodityPriceId",
DROP COLUMN "correct",
DROP COLUMN "currencyValueId",
DROP COLUMN "dateId",
DROP COLUMN "guess",
DROP COLUMN "interestRateId",
DROP COLUMN "stockPriceId",
DROP COLUMN "tries",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "Commodity";

-- DropTable
DROP TABLE "CommodityPrice";

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "attempted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL,
    "challengeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateId" TEXT NOT NULL,
    "interestRateId" TEXT NOT NULL,
    "stockPriceId" TEXT NOT NULL,
    "currencyValueId" TEXT NOT NULL,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultCategory" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "guess" DECIMAL(10,2) NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "tries" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "ResultCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_ip_key" ON "Guest"("ip");

-- CreateIndex
CREATE INDEX "Result_userId_date_idx" ON "Result"("userId", "date");

-- CreateIndex
CREATE INDEX "Result_guestId_date_idx" ON "Result"("guestId", "date");

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_interestRateId_fkey" FOREIGN KEY ("interestRateId") REFERENCES "InterestRatePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_stockPriceId_fkey" FOREIGN KEY ("stockPriceId") REFERENCES "StockPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_currencyValueId_fkey" FOREIGN KEY ("currencyValueId") REFERENCES "CurrencyValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultCategory" ADD CONSTRAINT "ResultCategory_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
