import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

const prisma = new PrismaClient();

@Injectable()
export class QuestionService {
  async getAll() {
    return await prisma.interviewQuestion.findMany();
  }

  async create(question: CreateQuestionDto) {
    return await prisma.interviewQuestion.create({
      data: {
        title: question.title,
        type: question.type,
        category: question.category,
      },
      select: {
        id: true,
        title: true,
        type: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateData: UpdateQuestionDto) {
    return await prisma.interviewQuestion.update({
      where: { id: String(id) },
      data: {
        title: updateData.title,
        type: updateData.type,
        category: updateData.category,
      },
      select: {
        id: true,
        title: true,
        type: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
