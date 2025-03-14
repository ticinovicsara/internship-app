import { useQuery } from 'react-query';
import { api } from '.';

const fetchAllQuestions = async () => {
  try {
    const response = await api.get('/questions');
    return response;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
};

export const useQuestions = () => {
  return useQuery('questions', fetchAllQuestions, {
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });
};
