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

  async update(id: string, updateData: UpdateQuestionDto) {
    return await this.prisma.interviewQuestion.update({
      where: { id: String(id) },
      data: {
        title: updateData.title,
        type: updateData.type,
        category: updateData.category,
        options: updateData.options,
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
}
