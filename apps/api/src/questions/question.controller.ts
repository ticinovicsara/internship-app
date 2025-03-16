import {
  Body,
  Controller,
  Put,
  Get,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminLogAction } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { LoggerService } from 'src/logger/logger.service';

import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuestionService } from './question.sevice';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

@Controller('questions')
@ApiTags('questions')
export class QuestionController {
  constructor(
    private readonly questionsService: QuestionService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    const questions = await this.questionsService.getAll();
    return questions;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    const question = await this.questionsService.getById(id);
    return question;
  }

  @Post('/category')
  @UseGuards(JwtAuthGuard)
  async getByDisciplines(@Body('disciplines') disciplines: string[]) {
    return this.questionsService.getByDisciplines(disciplines);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() question: CreateQuestionDto) {
    await this.loggerService.createAdminLog(
      AdminLogAction.Create,
      `Kreiranje pitanja: ${question.title}, Tip: ${question.type}, Kategorija: ${question.category}`,
    );

    const newQuestion = await this.questionsService.create(question);
    return newQuestion;
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateAll(@Body() updatedQuestions: UpdateQuestionDto[]) {
    await this.loggerService.createAdminLog(
      AdminLogAction.Update,
      `Ažuriranje ${updatedQuestions.length} pitanja`,
    );

    const results = await Promise.all(
      updatedQuestions.map(async (question) => {
        if (
          question.type !== 'Select' &&
          question.type !== 'Radio' &&
          question.type !== 'Checkbox'
        ) {
          question.options = undefined;
        }

        return await this.questionsService.update(question);
      }),
    );

    return {
      status: 'success',
      message: `${updatedQuestions.length} questions updated successfully`,
      data: results,
    };
  }
}
