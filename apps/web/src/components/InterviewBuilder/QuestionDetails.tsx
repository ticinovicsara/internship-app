import { QuestionType } from '@internship-app/types';
import { memo, useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem } from '@mui/material';
import { InterviewQuestion } from '@prisma/client';
import { QuestionCategory } from '../../constants/interviewConstants';

type Props = {
  question: InterviewQuestion;
  onUpdate: (updatedQuestion: Partial<InterviewQuestion>) => void;
};

const QuestionDetails = memo(({ question, onUpdate }: Props) => {
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedCategory, setEditedCategory] = useState(question.category);
  const [editedType, setEditedType] = useState(question.type);
  const [options, setOptions] = useState<string[]>(
    question.options ? question.options : [],
  );

  useEffect(() => {
    onUpdate({
      title: editedTitle,
      category: editedCategory,
      type: editedType,
      options,
    });
  }, [editedTitle, editedCategory, editedType, options, onUpdate]);

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setEditedCategory(event.target.value as string);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEditedType(event.target.value as string);
  };

  const handleOptionChange = (index: number, newOption: string) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = newOption;
      return updatedOptions;
    });
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
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

      {editedType === QuestionType.Select && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography>Opcije:</Typography>
          {options.map((option, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
            >
              <TextField
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                variant="outlined"
                label={`Opcija ${index + 1}`}
              />
              <Button
                onClick={() => handleRemoveOption(index)}
                variant="outlined"
              >
                Izbriši opciju
              </Button>
            </div>
          ))}
          <Button onClick={handleAddOption} variant="outlined">
            Dodaj opciju
          </Button>
        </div>
      )}
    </div>
  );
});

export default QuestionDetails;
