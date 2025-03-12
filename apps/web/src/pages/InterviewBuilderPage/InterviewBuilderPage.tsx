import { Question } from '@internship-app/types';
import { useQuestions } from '../../api/useFetchAllQuestions';
import LogoHeader from '../../components/LogoHeader';

export const InterviewBuilderPage = () => {
  const { data: questions, isLoading } = useQuestions();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <LogoHeader text="Interview Builder" />
      <h1>Interview Builder</h1>

      <h1>All Questions</h1>
      <ul>
        {questions ? (
          questions.map((q: Question) => <li key={q.id}>{q.title}</li>)
        ) : (
          <p>No questions available.</p>
        )}
      </ul>
    </div>
  );
};
