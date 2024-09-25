-- DropForeignKey
ALTER TABLE "DailyChallenge" DROP CONSTRAINT "DailyChallenge_currencyValueId_fkey";

-- DropForeignKey
ALTER TABLE "DailyChallenge" DROP CONSTRAINT "DailyChallenge_stockPriceId_fkey";

-- AlterTable
ALTER TABLE "DailyChallenge" ALTER COLUMN "stockPriceId" DROP NOT NULL,
ALTER COLUMN "currencyValueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_stockPriceId_fkey" FOREIGN KEY ("stockPriceId") REFERENCES "StockPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_currencyValueId_fkey" FOREIGN KEY ("currencyValueId") REFERENCES "CurrencyValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
