import { Question } from '@internship-app/types';
import { useState } from 'react';
import { useUpdateQuestion } from '../../api/useUpdateQuestion';

type Props = {
  question: Question;
};

const QuestionItem = ({ question }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const updateQuestion = useUpdateQuestion();

  const handleSave = () => {
    updateQuestion.mutate({ ...question, title: editedTitle });
    setIsEditing(false);
  };

  return (
    <li>
      <div>
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          <strong>{question.title}</strong>
        )}
      </div>
      <button onClick={() => setIsEditing(!isEditing)}>EDIT</button>
      <button>STATS</button>
      <button>DISABLE</button>

      {isEditing && <p>Forma za uređivanje pitanja...</p>}
    </li>
  );
};

export default QuestionItem;
