import { useState } from 'react';
import { Typography, TextField, Button, MenuItem } from '@mui/material';
import { QuestionType } from '@internship-app/types';
import { QuestionCategory } from '../../constants/interviewConstants';
import { InterviewQuestion } from '@prisma/client';

type Props = {
  onAddQuestion: (newQuestion: Omit<InterviewQuestion, 'id'>) => void;
};

const AddQuestionForm = ({ onAddQuestion }: Props) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setCategory(event.target.value as string);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };

  const handleOptionChange = (index: number, newOption: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newOption;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !category || !type) return;

    onAddQuestion({
      title,
      category,
      type,
      options: options,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(options);

    setTitle('');
    setCategory('');
    setType('');
    setOptions([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography variant="h6">Dodaj novo pitanje</Typography>
      <TextField
        fullWidth
        label="Tekst pitanja"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
      />
      <TextField
        select
        value={category}
        onChange={handleCategoryChange}
        variant="outlined"
        label="Područje"
      >
        {Object.values(QuestionCategory).map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        value={type}
        onChange={handleTypeChange}
        variant="outlined"
        label="Tip"
      >
        {Object.values(QuestionType).map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {type === QuestionType.Select && (
        <div>
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
                Izbriši
              </Button>
            </div>
          ))}
          <Button onClick={handleAddOption} variant="outlined">
            Dodaj opciju
          </Button>
        </div>
      )}

      <Button onClick={handleSubmit} variant="contained" color="primary">
        Dodaj pitanje
      </Button>
    </div>
  );
};

export default AddQuestionForm;
