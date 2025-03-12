import { PrismaClient } from '@prisma/client';
import { interviewQuestions } from '../../web/src/pages/InterviewPage/data';

const prisma = new PrismaClient();

export async function seedQuestions() {
  await Promise.all(
    interviewQuestions.map((q) =>
      prisma.interviewQuestion.upsert({
        where: { id: q.id },
        update: {},
        create: {
          id: q.id,
          title: q.title,
          type: q.type,
          category: q.category,
          createdAt: new Date(),
        },
      }),
    ),
  );
}

seedQuestions()
  .catch((error) => {
    console.error('Error seeding interview questions:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
