/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropTable
DROP TABLE "Answer";

-- CreateTable
CREATE TABLE "InternAnswer" (
    "id" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tick" BOOLEAN NOT NULL,

    CONSTRAINT "InternAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternAnswer_internId_questionId_key" ON "InternAnswer"("internId", "questionId");
