import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Card, CardContent } from '@mui/material';
import { api } from '../../api';

interface Answer {
  id: string;
  internName: string;
  answer: string;
  submittedAt: string;
}

const StatsPage = () => {
  const { questionId } = useParams();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await api.get(`/answers?questionId=${questionId}`);
        setAnswers(response.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju odgovora:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionId]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4">Odgovori na pitanje</Typography>
      {answers.length > 0 ? (
        <div>
          {answers.map((answer) => (
            <Card key={answer.id} style={{ margin: '10px 0', padding: '10px' }}>
              <CardContent>
                <Typography variant="h6">{answer.internName}</Typography>
                <Typography variant="body1">{answer.answer}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(answer.submittedAt).toLocaleDateString()}
                </Typography>
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

export default StatsPage;
