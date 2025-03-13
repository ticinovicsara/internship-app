import { useMutation } from 'react-query';
import axios from 'axios';
import { InterviewQuestion } from '@prisma/client';

const updateQuestionsOnWeb = async (questions: InterviewQuestion[]) => {
  try {
    const response = await axios.put('/api/questions/update', { questions });
    return response.data;
  } catch (error) {
    console.error('Error updating questions', error);
    throw new Error('Failed to update questions');
  }
};

export const useUpdateQuestions = () => {
  return useMutation(updateQuestionsOnWeb);
};
