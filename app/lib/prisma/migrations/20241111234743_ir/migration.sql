-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IRCategories" ADD VALUE 'T_1M';
ALTER TYPE "IRCategories" ADD VALUE 'T_3M';
ALTER TYPE "IRCategories" ADD VALUE 'T_4M';
ALTER TYPE "IRCategories" ADD VALUE 'T_6M';
