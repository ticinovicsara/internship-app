import { useQuery } from 'react-query';
import { api } from '.';

const STALE_TIME_5MIN = 1000 * 60 * 5;
const CACHE_TIME_10MIN = 1000 * 60 * 10;

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
    // staleTime: STALE_TIME_5MIN,
    // cacheTime: CACHE_TIME_10MIN,
  });
};
