import { Question, QuestionType } from '@internship-app/types';
import { useState } from 'react';
import { useUpdateQuestion } from '../../api/useUpdateQuestion';
import { Typography, TextField, Button, MenuItem } from '@mui/material';
import { InterviewQuestion } from '@prisma/client';
import { QuestionCategory } from '../../constants/interviewConstants';

type Props = {
  question: InterviewQuestion;
};

const QuestionDetails = ({ question }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedCategory, setEditedCategory] = useState(question.category);
  const [editedType, setEditedType] = useState(question.type);

  const updateQuestion = useUpdateQuestion();

  const options: string[] = question.options
    ? JSON.parse(question.options)
    : [];

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setEditedCategory(event.target.value as string);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEditedType(event.target.value as string);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Typography>Tip:</Typography>
        <TextField
          select
          value={editedType}
          onChange={handleTypeChange}
          variant="outlined"
          style={{ minWidth: '120px' }}
        >
          {Object.values(QuestionType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <Typography>Područje:</Typography>
        <TextField
          select
          value={editedCategory}
          onChange={handleCategoryChange}
          variant="outlined"
          style={{ width: '100px' }}
        >
          {Object.values(QuestionCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <TextField
        fullWidth
        label="Tekst pitanja"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        variant="outlined"
      />

      {question.options && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {options.map((option: string, index: number) => (
            <Button key={index} variant="outlined">
              {option}
            </Button>
          ))}
          <Button variant="outlined">DODAJ OPCIJU</Button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
