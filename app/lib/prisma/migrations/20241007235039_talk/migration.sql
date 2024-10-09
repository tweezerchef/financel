-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "score" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_DailyChallengeToResult" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DailyChallengeToResult_AB_unique" ON "_DailyChallengeToResult"("A", "B");

-- CreateIndex
CREATE INDEX "_DailyChallengeToResult_B_index" ON "_DailyChallengeToResult"("B");

-- CreateIndex
CREATE INDEX "Stock_name_idx" ON "Stock"("name");

-- AddForeignKey
ALTER TABLE "_DailyChallengeToResult" ADD CONSTRAINT "_DailyChallengeToResult_A_fkey" FOREIGN KEY ("A") REFERENCES "DailyChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyChallengeToResult" ADD CONSTRAINT "_DailyChallengeToResult_B_fkey" FOREIGN KEY ("B") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
