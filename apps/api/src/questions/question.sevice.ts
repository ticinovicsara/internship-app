import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { PrismaService } from 'src/prisma.service';
import { InterviewQuestion } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.interviewQuestion.findMany();
  }

  async getByDisciplines(disciplines: string[]): Promise<InterviewQuestion[]> {
    if (!disciplines || disciplines.length === 0) {
      return [];
    }

    const questions = await this.prisma.interviewQuestion.findMany({
      where: {
        category: {
          in: disciplines,
        },
      },
    });
    return questions;
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

  async getAnswersByQuestion(questionId: string) {
    return await this.prisma.answer.findMany({
      where: { questionId },
      select: {
        id: true,
        internName: true,
        answer: true,
        questionId: true,
      },
    });
  }
}
