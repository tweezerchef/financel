/*
  Warnings:

  - A unique constraint covering the columns `[resultId,category]` on the table `ResultCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResultCategory_resultId_category_key" ON "ResultCategory"("resultId", "category");
