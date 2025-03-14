import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.interviewQuestion.findMany();
  }

  async getByDiscipline(discipline: string) {
    return await this.prisma.interviewQuestion.findMany({
      where: { category: discipline },
    });
  }

  async create(question: CreateQuestionDto) {
    return await this.prisma.interviewQuestion.create({
      data: {
        title: question.title,
        type: question.type,
        category: question.category,
        options: question.options,
      },
      select: {
        id: true,
        title: true,
        type: true,
        options: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(question: UpdateQuestionDto) {
    return this.prisma.interviewQuestion.update({
      where: { id: question.id },
      data: {
        title: question.title,
        type: question.type,
        category: question.category,
        options: question.options ?? null,
      },
    });
  }
}
