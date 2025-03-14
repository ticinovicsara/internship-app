import { useMutation, useQueryClient } from 'react-query';
import { api } from '.';
import { InterviewQuestion } from '@prisma/client';

const addQuestion = async (newQuestion: Omit<InterviewQuestion, 'id'>) => {
  const response = await api.post('/questions', newQuestion);

  return response.data;
};

export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(addQuestion, {
    onSuccess: (newQuestion) => {
      queryClient.setQueryData(
        'questions',
        (oldQuestions: InterviewQuestion[] | undefined) => [
          ...(oldQuestions || []),
          newQuestion,
        ],
      );
      queryClient.invalidateQueries(['questions']);
    },
    onError: (error) => {
      console.error('Failed to add question:', error);
    },
  });
};
