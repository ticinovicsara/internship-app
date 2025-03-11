import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.sevice';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, LoggerService],
  exports: [QuestionService],
})
export class QuestionsModule {}
