import { useState } from 'react';
import { Question } from '@internship-app/types';
import { useQuestions } from '../../api/useFetchAllQuestions';
import LogoHeader from '../../components/LogoHeader';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const InterviewBuilderPage = () => {
  const { data: apiResponse, isLoading } = useQuestions();
  const [isEditing, setIsEditing] = useState(false);

  const questions = Array.isArray(apiResponse) ? apiResponse : [];

  console.log('Questions data:', questions);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <LogoHeader text="Interview Builder" />
      <h1>Interview Builder</h1>

      <Button variant="outlined" onClick={() => setIsEditing(true)}>
        Dodaj pitanje
      </Button>
      <Button variant="outlined" onClick={() => setIsEditing(true)}>
        Spremi promjene
      </Button>
      {isEditing && <p>Forma za dodavanje pitanja dolazi ovdje...</p>}

      <h2>Trenutna pitanja</h2>
      <ul>
        <div>
          {questions ? (
            questions.map((q: Question) => (
              <Accordion key={q.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{q.title}</Typography>
                  <Typography
                    sx={{ color: 'text.secondary', marginLeft: '10px' }}
                  >
                    {q.type}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Tip: {q.type}</Typography>
                  <TextField
                    fullWidth
                    label="Tekst pitanja"
                    defaultValue={q.title}
                  />
                  <Button variant="outlined">DISABLE</Button>
                  <Button variant="outlined">EDIT</Button>
                  <Button variant="outlined">STATS</Button>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </ul>
    </div>
  );
};
