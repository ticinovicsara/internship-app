import { useMutation } from 'react-query';
import { InterviewQuestion } from '@prisma/client';

const updateQuestionsOnWeb = async (questions: InterviewQuestion[]) => {
  try {
    const response = await fetch('http://localhost:3000/api/questions/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(questions),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error updating questions', error);
    throw new Error('Failed to update questions');
  }
};

export const useUpdateQuestions = () => {
  return useMutation(updateQuestionsOnWeb);
};
