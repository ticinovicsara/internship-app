import { SetInterviewRequest } from '@internship-app/types';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '.';

const setInterview = async (req: SetInterviewRequest) => {
  console.log('API SETINTERVIEW: ', req);

  return await api.put<SetInterviewRequest, never>(
    `http://localhost:3000/api/intern/setInterview/${req.internId}`,
    req,
  );
};

export const useSetInterview = (navigate: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(setInterview, {
    onSuccess: (_data, variables) => {
      toast.success('Intervju uspješno pohranjen!');
      queryClient.invalidateQueries(['intern', variables.internId]);
      navigate();
    },
    onError: (error: string) => {
      toast.error(`Greška pri pohranjivanju intervjua: ${error}`);
    },
  });
};
