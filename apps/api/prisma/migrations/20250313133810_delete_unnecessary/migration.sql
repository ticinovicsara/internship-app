/*
  Warnings:

  - You are about to drop the column `max` on the `InterviewQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `InterviewQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `InterviewQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "max",
DROP COLUMN "min",
DROP COLUMN "step";
