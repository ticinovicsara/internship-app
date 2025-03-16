import { Typography, Card, CardContent, Button } from '@mui/material';
import LogoHeader from '../../components/LogoHeader';
import { useFetchAnswersForQuestion } from '../../api/useFetchAnswers';
import { Path } from '../../constants/paths';
import { Link, useRoute } from 'wouter';
import { LoaderIcon } from 'react-hot-toast';
import { useFetchQuestion } from '../../api/useFetchQuestion';
import { useState } from 'react';

export const StatsPage = () => {
  const [, params] = useRoute(Path.QuestionsStats);
  const [flaggedAnswers, setFlaggedAnswers] = useState<{
    [key: string]: boolean;
  }>({});

  const questionId = params?.questionId;

  const { data: answers = [], isLoading: answerLoading } = questionId
    ? useFetchAnswersForQuestion(questionId)
    : { data: [], isLoading: false };

  const { data: question, isLoading: questionLoading } = questionId
    ? useFetchQuestion(questionId)
    : { data: [], isLoading: false };

  const handleFlagAnswer = (internId: string) => {
    setFlaggedAnswers((prev: { [key: string]: boolean }) => ({
      ...prev,
      [internId]: !prev[internId],
    }));
  };

  console.log('Usli, ', answers);

  if (answerLoading || questionLoading) return <LoaderIcon />;

  return (
    <div>
      <LogoHeader text="Question Stats" />

      {question && (
        <Card
          style={{ margin: '10px 0', padding: '10px', textAlign: 'center' }}
        >
          <Typography variant="h3" style={{ padding: '20px' }}>
            {question.title}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginRight: '130px',
              padding: '15px',
              marginTop: '15px',
            }}
          >
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              Ime i prezime
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              Odgovor
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              Akcije
            </Typography>
          </div>
        </Card>
      )}

      {answers.length > 0 ? (
        <div>
          {answers.map((answer) => (
            <Card
              key={answer.internId}
              style={{ margin: '10px 0', padding: '10px' }}
            >
              <CardContent
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="h6">
                  {answer.internFirstName} {answer.internLastName}:
                </Typography>
                <Typography variant="body1">{answer.answer}</Typography>

                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <Typography variant="body1">
                    {answer.tick ? '✔️' : '❌'}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => handleFlagAnswer(answer.internId)}
                    style={{
                      borderColor: flaggedAnswers[answer.internId] ? 'red' : '',
                      color: flaggedAnswers[answer.internId] ? 'red' : '',
                    }}
                  >
                    FLAG
                  </Button>

                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/admin/intern/${answer.internId}`}
                  >
                    UĐI U PRIPRAVNIKA
                  </Button>
                </div>
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
