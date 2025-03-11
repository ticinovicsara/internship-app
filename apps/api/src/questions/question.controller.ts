import {
  Body,
  Controller,
  Put,
  Get,
  Param,
  Post,
  UseGuards,
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateData: UpdateQuestionDto) {
    await this.loggerService.createAdminLog(
      AdminLogAction.Update,
      `Uređivanje pitanja sa ID: ${id}`,
    );

    const updatedQuestion = await this.questionsService.update(id, updateData);
    return updatedQuestion;
  }
}
