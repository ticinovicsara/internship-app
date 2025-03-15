import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateQuestionWithAnswerDto {
  @IsString()
  internId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  questions: {
    questionId: string;
    answer: string;
    tick: boolean;
  }[];
}
