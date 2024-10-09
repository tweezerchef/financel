/*
  Warnings:

  - A unique constraint covering the columns `[interestRateYearDataId]` on the table `DailyChallenge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockYearDataId]` on the table `DailyChallenge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currencyYearDataId]` on the table `DailyChallenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DailyChallenge" ADD COLUMN     "currencyYearDataId" TEXT,
ADD COLUMN     "interestRateYearDataId" TEXT,
ADD COLUMN     "stockYearDataId" TEXT;

-- CreateTable
CREATE TABLE "YearData" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "dataPoints" JSONB NOT NULL,

    CONSTRAINT "YearData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_interestRateYearDataId_key" ON "DailyChallenge"("interestRateYearDataId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_stockYearDataId_key" ON "DailyChallenge"("stockYearDataId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_currencyYearDataId_key" ON "DailyChallenge"("currencyYearDataId");

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_interestRateYearDataId_fkey" FOREIGN KEY ("interestRateYearDataId") REFERENCES "YearData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_stockYearDataId_fkey" FOREIGN KEY ("stockYearDataId") REFERENCES "YearData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_currencyYearDataId_fkey" FOREIGN KEY ("currencyYearDataId") REFERENCES "YearData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
