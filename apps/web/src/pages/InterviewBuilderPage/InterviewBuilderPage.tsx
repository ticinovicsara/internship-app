import { useCallback, useMemo, useState } from 'react';
import { InterviewQuestion } from '@prisma/client';
import { useQuestions } from '../../api/useFetchAllQuestions';
import LogoHeader from '../../components/LogoHeader';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionDetails from '../../components/InterviewBuilder/QuestionDetails';
import AddQuestionForm from '../../components/InterviewBuilder/AddQuestionForm';
import { useAddQuestion } from '../../api/useAddQuestion';
import { useUpdateQuestions } from '../../api/useUpdateQuestion';

type NewInterviewQuestion = Omit<InterviewQuestion, 'id'>;

export const InterviewBuilderPage = () => {
  const { data: apiResponse, isLoading } = useQuestions();
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [modifiedQuestions, setModifiedQuestions] = useState<
    Map<string, Partial<InterviewQuestion>>
  >(new Map());

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  const { mutate: addQuestion } = useAddQuestion();
  const { mutateAsync: updateAllQuestions } = useUpdateQuestions();

  useMemo(() => {
    if (apiResponse && Array.isArray(apiResponse)) {
      setQuestions(apiResponse);
    }
  }, [apiResponse]);

  const handleChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent) => {
      setExpanded((prev) => (prev === panel ? false : panel));
    },
    [],
  );

  const handleSaveChanges = async () => {
    const updatedQuestions = Array.from(modifiedQuestions.values()).map(
      (modifiedQuestion) => {
        return {
          ...modifiedQuestion,
          id: modifiedQuestion.id!,
          title: modifiedQuestion.title!,
          type: modifiedQuestion.type!,
          category: modifiedQuestion.category!,
          options: modifiedQuestion.options!,
          createdAt: modifiedQuestion.createdAt!,
          updatedAt: modifiedQuestion.updatedAt!,
        };
      },
    );

    if (updatedQuestions.length > 0) {
      await updateAllQuestions(updatedQuestions);
      console.log('Pitanja uspješno ažurirana!');
      setModifiedQuestions(new Map());
    } else {
      console.log('Nema izmjena za spremiti.');
    }
  };

  const handleAddQuestion = async (newQuestion: NewInterviewQuestion) => {
    addQuestion(newQuestion, {
      onSuccess: () => {
        console.log('Pitanje uspješno dodano!');
        setIsEditing(false);
      },
      onError: () => {
        console.error('Dodavanje pitanja nije uspjelo.');
      },
    });
  };

  const handleUpdateQuestion = (
    id: string,
    updatedData: Partial<InterviewQuestion>,
  ) => {
    setModifiedQuestions((prevModifiedQuestions) => {
      const updated = new Map(prevModifiedQuestions);
      updated.set(id, updatedData);
      return updated;
    });

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, ...updatedData } : q)),
    );
  };

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
        <Button variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          Dodaj pitanje
        </Button>
        <Button variant="outlined" onClick={handleSaveChanges}>
          Spremi promjene
        </Button>
      </div>

      {isEditing && <AddQuestionForm onAddQuestion={handleAddQuestion} />}

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
                        borderRadius: '5px',
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
                  {expanded === q.id && (
                    <QuestionDetails
                      question={q}
                      onUpdate={(data) => handleUpdateQuestion(q.id, data)}
                    />
                  )}
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
