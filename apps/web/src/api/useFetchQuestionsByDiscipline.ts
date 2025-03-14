import { useQuery } from 'react-query';
import { api } from '.';
import { Discipline } from '@internship-app/types';
import { InterviewQuestion } from '@prisma/client';

const fetchQuestionsByDiscipline = async (
  discipline: Discipline[],
): Promise<InterviewQuestion[]> => {
  const { data } = await api.get(`/questions/category/${discipline}`);
  return data;
};

export const useFetchQuestionsByDiscipline = (discipline: Discipline[]) => {
  return useQuery(
    ['questions', discipline],
    () => fetchQuestionsByDiscipline(discipline),
    {
      enabled: !!discipline,
      staleTime: 1000 * 60 * 5,
    },
  );
};
