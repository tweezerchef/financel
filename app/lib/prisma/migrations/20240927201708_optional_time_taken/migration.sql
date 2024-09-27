-- AlterTable
ALTER TABLE "ResultCategory" ALTER COLUMN "correct" SET DEFAULT false,
ALTER COLUMN "timeTaken" DROP NOT NULL;
