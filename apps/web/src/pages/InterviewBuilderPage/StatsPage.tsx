import { CircularProgress, Typography, Card, CardContent } from '@mui/material';
import LogoHeader from '../../components/LogoHeader';
import { useFetchAnswersForQuestion } from '../../api/useFetchAnswers';
import { useParams } from 'react-router-dom';

export const StatsPage = () => {
  const { id } = useParams<{ id: string }>();
  const questionId = id;

  const { data: answers = [], isLoading } =
    useFetchAnswersForQuestion(questionId);

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <LogoHeader text="Interview Builder" />
      <Typography variant="h4">Odgovori na pitanje</Typography>
      {answers.length > 0 ? (
        <div>
          {answers.map((answer) => (
            <Card
              key={answer.internId}
              style={{ margin: '10px 0', padding: '10px' }}
            >
              <CardContent>
                <Typography variant="h6">
                  {answer.internFirstName} {answer.internLastName}
                </Typography>
                <Typography variant="body1">{answer.answer}</Typography>
                <Typography variant="body1">{answer.tick}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Typography variant="body1">Nema odgovora za ovo pitanje.</Typography>
      )}
    </div>
  );
};
