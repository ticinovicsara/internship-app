import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.sevice';
import { PrismaService } from 'src/prisma.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [QuestionController],
  providers: [PrismaService, QuestionService],
})
export class QuestionsModule {}
