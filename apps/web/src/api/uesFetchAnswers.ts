import { Answer } from '@prisma/client';
import { api } from '.';
import { useQuery } from 'react-query';

const fetchAnswers = async (questionId: string) => {
  if (!questionId) return [];
  const response = await api.get<Answer[]>(
    `http://localhost:3000/api/answers?questionId=${questionId}`,
  );
  return response.data;
};

export const useFetchAnswers = (questionId?: string) => {
  return useQuery(['answers', questionId], () => fetchAnswers(questionId!), {
    enabled: !!questionId,
  });
};
