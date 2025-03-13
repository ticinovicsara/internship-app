/*
  Warnings:

  - The `options` column on the `InterviewQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "options",
ADD COLUMN     "options" TEXT[];
