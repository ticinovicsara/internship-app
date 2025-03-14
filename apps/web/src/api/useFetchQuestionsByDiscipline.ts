import { useQuery } from 'react-query';
import { api } from '.';
import { InterviewQuestion } from '@prisma/client';
import { QuestionCategory } from '../constants/interviewConstants';

const fetchQuestionsByDiscipline = async (
  disciplines: QuestionCategory[],
): Promise<InterviewQuestion[]> => {
  const response = await api.get(
    `http://localhost:3000/api/questions/category/${disciplines}`,
  );

  console.log('Raw Response:', response);
  console.log('API Response Data:', response.data);

  return response.data;
};

export const useFetchQuestionsByDiscipline = (
  disciplines: QuestionCategory[],
) => {
  return useQuery(
    ['questions', disciplines],
    () => fetchQuestionsByDiscipline(disciplines),
    {
      enabled: !!disciplines,
      staleTime: 1000 * 60 * 5,
    },
  );
};
