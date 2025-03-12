import { useQuery } from 'react-query';
import { api } from '.';

const fetchAllQuestions = async () => {
  const response = await api.get('/questions');
  return response || [];
};

export const useQuestions = () => {
  return useQuery('questions', fetchAllQuestions);
};
