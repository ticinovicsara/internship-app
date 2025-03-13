import { useMutation, useQueryClient } from 'react-query';
import { api } from '.';
import { Question } from '@internship-app/types';

const updateQuestion = async (updatedQuestion: Question) => {
  const response = await api.put(
    `/questions/${updatedQuestion.id}`,
    updatedQuestion,
  );
  return response.data;
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(updateQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries('questions');
    },
  });
};
