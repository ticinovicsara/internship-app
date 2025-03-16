import { Typography, Card, CardContent } from '@mui/material';
import LogoHeader from '../../components/LogoHeader';
import { useFetchAnswersForQuestion } from '../../api/useFetchAnswers';
import { Path } from '../../constants/paths';
import { useRoute } from 'wouter';
import { LoaderIcon } from 'react-hot-toast';

export const StatsPage = () => {
  const [, params] = useRoute(Path.QuestionsStats);

  const questionId = params?.questionId;

  const { data: answers = [], isLoading } = questionId
    ? useFetchAnswersForQuestion(questionId)
    : { data: [], isLoading: false };

  if (isLoading) return <LoaderIcon />;

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
