import { useQuery } from 'react-query';
import { api } from '.';
import { QuestionCategory } from '../constants/interviewConstants';

const UNIVERSAL_CATEGORIES: QuestionCategory[] = [
  QuestionCategory.General,
  QuestionCategory.Final,
  QuestionCategory.Personal,
];

const fetchQuestionsByDisciplines = async (categories: QuestionCategory[]) => {
  try {
    const response = await api.post(
      `http://localhost:3000/api/questions/category`,
      {
        disciplines: categories,
      },
    );

    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const useFetchQuestionsByDisciplines = (
  disciplines: QuestionCategory[],
) => {
  const allCategories = [...new Set([...UNIVERSAL_CATEGORIES, ...disciplines])];

  return useQuery(
    ['questions', allCategories],
    async () => {
      const data = await fetchQuestionsByDisciplines(allCategories);
      return Array.isArray(data) ? data : [];
    },
    {
      enabled: allCategories.length > 0,
    },
  );
};
