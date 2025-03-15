-- AddForeignKey
ALTER TABLE "InternAnswer" ADD CONSTRAINT "InternAnswer_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
