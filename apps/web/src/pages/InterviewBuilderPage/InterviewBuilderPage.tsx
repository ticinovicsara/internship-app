import { useCallback, useEffect, useState } from 'react';
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
import { useQueryClient } from 'react-query';
import { useLocation } from 'wouter';

export const InterviewBuilderPage = () => {
  const { data: apiResponse, isLoading } = useQuestions();
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [modifiedQuestions, setModifiedQuestions] = useState<
    Map<string, Partial<InterviewQuestion>>
  >(new Map());
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  const { mutate: addQuestion } = useAddQuestion();
  const { mutateAsync: updateAllQuestions } = useUpdateQuestions();

  useEffect(() => {
    if (Array.isArray(apiResponse)) {
      setQuestions(apiResponse);
    }
  }, [apiResponse]);

  const handleChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    [],
  );

  const handleSaveChanges = async () => {
    if (modifiedQuestions.size === 0) {
      console.log('Nema izmjena za spremiti.');
      return;
    }

    const updatedQuestions = Array.from(modifiedQuestions.entries()).map(
      ([id, updatedData]) => ({
        id,
        ...updatedData,
        updatedAt: new Date(),
      }),
    );

    try {
      const validQuestions = updatedQuestions as {
        id: string;
        title: string;
        type: string;
        category: string;
        options: string[];
        min: number;
        max: number;
        step: number;
        createdAt: Date;
        updatedAt: Date;
        isDisabled: boolean;
      }[];

      await updateAllQuestions(validQuestions);
      console.log('Ažurirana pitanja su uspješno spremljena!');
      setModifiedQuestions(new Map());
      queryClient.invalidateQueries(['questions']);
    } catch (error) {
      console.error('Greška pri spremanju izmjena:', error);
    }
  };

  const handleAddQuestion = async (newQuestion: InterviewQuestion) => {
    console.log('📢 Pozivam addQuestion s:', newQuestion);

    try {
      addQuestion(newQuestion, {
        onSuccess: (addedQuestion) => {
          console.log('Pitanje uspješno dodano!', addedQuestion);
          setIsEditing(false);
          setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);

          setTimeout(() => {
            queryClient.invalidateQueries(['questions']);
          }, 1000);
        },
        onError: (error) => {
          console.error('Dodavanje pitanja nije uspjelo.', error);
        },
      });
    } catch (error) {
      console.error('Greška pri dodavanju pitanja:', error);
    }
  };

  const handleUpdateQuestion = (
    id: string,
    updatedData: Partial<InterviewQuestion>,
  ) => {
    setModifiedQuestions((prevModifiedQuestions) => {
      const existingChanges = prevModifiedQuestions.get(id) || {};
      const updated = new Map(prevModifiedQuestions);

      updated.set(id, { ...existingChanges, ...updatedData });

      return updated;
    });

    setQuestions((prevQuestions) => {
      const index = prevQuestions.findIndex((q) => q.id === id);
      if (index === -1) return prevQuestions;

      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], ...updatedData };

      return updatedQuestions;
    });
  };

  const handleDisableQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, isDisabled: !q.isDisabled } : q,
      ),
    );

    setModifiedQuestions((prevModifiedQuestions) => {
      const existingQuestion = questions.find((q) => q.id === id);
      if (!existingQuestion) return prevModifiedQuestions;

      const wasDisabled = existingQuestion.isDisabled;
      const newDisabledState = !wasDisabled;

      if (wasDisabled === newDisabledState) return prevModifiedQuestions;

      const updated = new Map(prevModifiedQuestions);
      updated.set(id, { isDisabled: newDisabledState });
      return updated;
    });
  };

  if (isLoading || !apiResponse) {
    return <p>Loading...</p>;
  }

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
        <Button
          variant="outlined"
          onClick={handleSaveChanges}
          disabled={modifiedQuestions.size === 0}
        >
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
                style={{
                  marginBottom: '15px',
                  backgroundColor: q.isDisabled ? '#e0e0e0' : 'white',
                  opacity: q.isDisabled ? 0.6 : 1,
                }}
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
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: 'white' }}
                      onClick={() => handleDisableQuestion(q.id)}
                    >
                      {q.isDisabled ? 'ENABLE' : 'DISABLE'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setLocation(`/stats/${q.id}`)}
                    >
                      STATS
                    </Button>
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
