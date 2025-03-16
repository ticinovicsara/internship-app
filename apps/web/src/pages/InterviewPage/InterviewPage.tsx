import {
  Discipline,
  Intern,
  InterviewStatus,
  QuestionType,
} from '@internship-app/types';
import { Json } from '@internship-app/types/src/json';
import { useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { LoaderIcon } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { Link, useRoute } from 'wouter';
import { navigate } from 'wouter/use-location';

import { useFetchIntern } from '../../api/useFetchIntern';
import { useSetImage } from '../../api/useSetImage';
import { useSetInterview } from '../../api/useSetInterview';
import AdminPage from '../../components/AdminPage';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import IntervieweeInfo from '../../components/IntervieweeInfo';
import MultistepForm from '../../components/MultistepForm';
import {
  filterInterviewSteps as getFilteredInterviewSteps,
  QuestionCategory,
} from '../../constants/interviewConstants';
import { Path } from '../../constants/paths';
import InterviewQuestionHandler from './InterviewQuestionHandler';
import { useFetchQuestionsByDisciplines } from '../../api/useFetchQuestionsByDiscipline';
import { InterviewQuestion } from '@prisma/client';

const mapAnswersToQuestions = (
  answers: FieldValues,
  questions: InterviewQuestion[],
): {
  [key: string]: { questionId: string; value: string | number; tick?: boolean };
} => {
  return questions.reduce(
    (acc, question) => {
      if (answers[question.id]) {
        acc[question.id] = {
          questionId: question.id,
          value:
            answers[question.id]?.value ??
            (question.type === QuestionType.Checkbox ? false : ''),
          tick: answers[question.id]?.tick ?? false,
        };
      }
      return acc;
    },
    {} as {
      [key: string]: {
        questionId: string;
        value: string | number;
        tick?: boolean;
      };
    },
  );
};

const DISCIPLINE_TO_CATEGORIES: Record<Discipline, QuestionCategory[]> = {
  [Discipline.Development]: [QuestionCategory.Development],
  [Discipline.Design]: [QuestionCategory.Design],
  [Discipline.Marketing]: [QuestionCategory.Marketing],
  [Discipline.Multimedia]: [QuestionCategory.Multimedia],
};

const InterviewPage = () => {
  const [, params] = useRoute(Path.Interview);
  const internId = params?.internId;

  const { data: intern, isFetching } = useFetchIntern(internId);
  const internDisciplines =
    intern?.internDisciplines.map((d) => d.discipline) || [];

  const disciplineCategories = internDisciplines.flatMap(
    (discipline) => DISCIPLINE_TO_CATEGORIES[discipline] || [],
  );

  const setInterview = useSetInterview(() => {
    navigate(Path.Intern.replace(':internId', params?.internId || ''));
  });
  const setImage = useSetImage();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);

  const memoizedDisciplines = useMemo(
    () => disciplineCategories,
    [disciplineCategories],
  );

  const { data: interviewQuestions = [], refetch } =
    useFetchQuestionsByDisciplines(memoizedDisciplines);

  useEffect(() => {
    localStorage.removeItem('interviewQuestions');
    if (interviewQuestions.length > 0) {
      localStorage.setItem(
        'interviewQuestions',
        JSON.stringify(interviewQuestions),
      );
    }
  }, [interviewQuestions]);

  const localFormValue = JSON.parse(
    localStorage.getItem(`interview ${internId}`)!,
  );
  const form = useForm<FieldValues>({
    defaultValues: { ...localFormValue },
  });

  const memoizedQuestions = useMemo(
    () => interviewQuestions,
    [interviewQuestions],
  );

  useEffect(() => {
    localStorage.setItem(`interview ${internId}`, JSON.stringify(form.watch()));
  });

  useEffect(() => {
    if (!intern) return;

    const internAnswers = Object.values(
      intern?.interviewSlot?.answers || {},
    ) as unknown as Json[];

    const answersValues = Object.values(internAnswers).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id as string]: { value: curr.value, tick: curr.tick },
      }),
      {},
    );
    form.reset({ ...answersValues });
  }, [form, intern]);

  const handleFormSubmit = (internId: string) =>
    form.handleSubmit((data) => {
      const answers = mapAnswersToQuestions(data, interviewQuestions);

      const score = Object.values(answers)
        .map((answer) => {
          const question = interviewQuestions.find(
            (q: InterviewQuestion) => q.id === answer.questionId,
          );
          return question &&
            question.type === QuestionType.Slider &&
            (question.category === QuestionCategory.Final ||
              (question.category === QuestionCategory.Marketing &&
                intern?.internDisciplines?.some(
                  (d) => d.discipline === 'Marketing',
                )))
            ? Number(answer.value) || 0
            : 0;
        })
        .reduce((acc, curr) => acc + curr, 0);

      setInterview.mutate({ internId, answers, score });
    })();

  const handleSetImage = async (base64: string) => {
    if (!internId) return;

    if (!base64) {
      queryClient.setQueryData(
        ['intern', internId],
        (prev: Intern | undefined) => ({ ...prev, image: '' }) as Intern,
      );
      return;
    }

    const blob = await fetch(base64).then((res) => res.blob());
    const image = await setImage.mutateAsync({ internId, blob });

    queryClient.setQueryData(
      ['intern', internId],
      (prev: Intern | undefined) => ({ ...prev, image }) as Intern,
    );
  };

  if (isFetching) {
    return <LoaderIcon />;
  }

  if (!internId || !intern) {
    return <div>Intern ovog ID-a ne postoji!</div>;
  }

  if (intern.interviewStatus !== InterviewStatus.Pending) {
    return (
      <div>
        <p>
          Intervju status interna {intern.firstName} {intern.lastName} nije
          pending nego {intern.interviewStatus}!
        </p>
        <Link to={Path.Intern.replace(':internId', intern.id)}>
          Otvori profil
        </Link>
      </div>
    );
  }

  return (
    <AdminPage>
      <IntervieweeInfo
        image={intern.image || ''}
        setImage={handleSetImage}
        intern={intern}
      />
      <MultistepForm
        questions={memoizedQuestions}
        form={form}
        steps={getFilteredInterviewSteps(
          intern.internDisciplines.map((ind) => ind.discipline),
        )}
        onSubmit={() => setDialogOpen(true)}
        InputHandler={InterviewQuestionHandler}
      />
      <ConfirmDialog
        open={!!dialogOpen}
        handleClose={(confirmed) => {
          if (confirmed) handleFormSubmit(internId);
          setDialogOpen(false);
        }}
        title="Potvrdi unos intervjua!"
        description={`Uneseni intervju ne može se poništiti.`}
      />
    </AdminPage>
  );
};

export default InterviewPage;
