import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Card, CardContent } from '@mui/material';
import LogoHeader from '../../components/LogoHeader';
import { useFetchAnswers } from '../../api/useFetchAnswers';

export const StatsPage = () => {
  const { questionId } = useParams();

  const { data: answers = [], isLoading } = useFetchAnswers(questionId);

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <LogoHeader text="Interview Builder" />
      <Typography variant="h4">Odgovori na pitanje</Typography>
      {answers.length > 0 ? (
        <div>
          {answers.map((answer) => (
            <Card key={answer.id} style={{ margin: '10px 0', padding: '10px' }}>
              <CardContent>
                <Typography variant="h6">{answer.internName}</Typography>
                <Typography variant="body1">{answer.answer}</Typography>
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
