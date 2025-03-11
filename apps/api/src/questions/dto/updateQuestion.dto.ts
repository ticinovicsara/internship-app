import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsNotEmpty()
  @IsString()
  title?: string;
  type?: string;
  category?: string;
}
