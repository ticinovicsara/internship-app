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
    const response = await api.post(`/questions/category`, {
      disciplines: categories,
    });

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

  const cacheKey = `questions_${allCategories.sort().join('_')}`;

  const storedQuestions = JSON.parse(localStorage.getItem(cacheKey) || '[]');

  return useQuery(
    ['questions', allCategories],
    async () => {
      const data = await fetchQuestionsByDisciplines(allCategories);

      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }

      return Array.isArray(data) ? data : [];
    },
    {
      enabled: storedQuestions.length === 0,
      initialData: storedQuestions,
    },
  );
};
