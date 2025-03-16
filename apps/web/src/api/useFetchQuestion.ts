import { useQuery } from 'react-query';
import { api } from '.';

const fetchQuestionById = async (questionId: string) => {
  const response = await api.get(
    `http://localhost:3000/api/questions/${questionId}`,
  );
  return response;
};

export const useFetchQuestion = (questionId: string) => {
  return useQuery(
    ['question', questionId],
    () => fetchQuestionById(questionId),
    {
      enabled: !!questionId,
    },
  );
};
