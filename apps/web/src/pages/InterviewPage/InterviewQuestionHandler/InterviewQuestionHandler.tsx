import { Question, QuestionType } from '@internship-app/types';
import { Box, Typography } from '@mui/material';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { InterviewQuestion } from '@prisma/client';

import InputHandler from '../../../components/InputHandler';
import { memo } from 'react';

export type ExtendedQuestion = InterviewQuestion & {
  required?: boolean;
  registerValue?: any;
};

type InterviewQuestionHandlerProps = {
  question: Question;
  form: UseFormReturn<FieldValues>;
};

const InterviewQuestionHandler = memo(
  ({ question, form }: InterviewQuestionHandlerProps) => {
    const questionForValue = {
      ...question,
      id: `${question.id}.value`,
      title: question.title ?? '',
    };
    const questionForTick: Question = {
      ...question,
      id: `${question.id}.tick`,
      type: QuestionType.Checkbox,
    };

    return (
      <Box display="flex" flexDirection="column">
        <Typography whiteSpace="pre-line">{question.title}</Typography>
        <Box display="flex">
          <InputHandler question={questionForValue} form={form} />
          <InputHandler question={questionForTick} form={form} />
        </Box>
      </Box>
    );
  },
);

export default InterviewQuestionHandler;
