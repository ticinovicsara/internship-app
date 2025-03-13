import { useState } from 'react';
import { InterviewQuestion } from '@prisma/client';
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
import QuestionDetails from '../../components/InterviewBuilder/QuestionDetails';

export const InterviewBuilderPage = () => {
  const { data: apiResponse, isLoading } = useQuestions();
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const questions = Array.isArray(apiResponse) ? apiResponse : [];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <LogoHeader text="Interview Builder" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          padding: '5px',
        }}
      >
        <h2>Trenutna pitanja</h2>
        <Button variant="outlined" onClick={() => setIsEditing(true)}>
          Dodaj pitanje
        </Button>
        <Button variant="outlined" onClick={() => setIsEditing(true)}>
          Spremi promjene
        </Button>
      </div>
      {isEditing && <p>Forma za dodavanje pitanja dolazi ovdje...</p>}

      <ul>
        <div>
          {questions ? (
            questions.map((q: InterviewQuestion) => (
              <Accordion
                key={q.id}
                expanded={expanded === q.id}
                onChange={handleChange(q.id)}
                style={{ marginBottom: '15px' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>{q.title}</Typography>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      gap: '5px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        marginRight: '10px',
                        border: '1px solid orange',
                        borderRadius: '2px',
                        padding: '5px',
                      }}
                    >
                      {q.category}
                    </Typography>
                    <Typography
                      sx={{ color: 'text.secondary', marginRight: '10px' }}
                    >
                      {q.type}
                    </Typography>
                    <Button variant="outlined">DISABLE</Button>
                    <Button variant="outlined">STATS</Button>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <QuestionDetails question={q} />
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
