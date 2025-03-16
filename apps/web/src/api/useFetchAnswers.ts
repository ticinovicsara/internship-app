import { useQuery } from 'react-query';
import { api } from '.';
import { AnswersWithIntern } from '@internship-app/types';

const fetchAnswersForQuestion = async (
  questionId: string,
): Promise<AnswersWithIntern[]> => {
  const response = await api.get(
    `http://localhost:3000/api/interview-slot/answers/${questionId}`,
  );
  return response;
};

export const useFetchAnswersForQuestion = (questionId: string) => {
  return useQuery<AnswersWithIntern[], Error>(
    ['answers', questionId],
    () => fetchAnswersForQuestion(questionId),
    {
      enabled: !!questionId,
    },
  );
};
