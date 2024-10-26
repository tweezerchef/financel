-- CreateTable
CREATE TABLE "CategoryStatistics" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "totalScore" DECIMAL(20,2) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryStatistics_category_key" ON "CategoryStatistics"("category");

-- CreateIndex
CREATE INDEX "CategoryStatistics_category_idx" ON "CategoryStatistics"("category");
