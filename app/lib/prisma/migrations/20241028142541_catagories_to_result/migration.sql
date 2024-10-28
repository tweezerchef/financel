-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "currencyScore" DECIMAL(10,2),
ADD COLUMN     "interestRateScore" DECIMAL(10,2),
ADD COLUMN     "stockScore" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastPlay" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Result_date_interestRateScore_idx" ON "Result"("date", "interestRateScore");

-- CreateIndex
CREATE INDEX "Result_date_currencyScore_idx" ON "Result"("date", "currencyScore");

-- CreateIndex
CREATE INDEX "Result_date_stockScore_idx" ON "Result"("date", "stockScore");

-- CreateIndex
CREATE INDEX "Result_date_score_idx" ON "Result"("date", "score");
