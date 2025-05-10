import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '../styles/styled';

const NoteFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const NoteInput = styled.textarea`
  min-height: 120px;
  width: 100%;
  resize: none;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(0, 0, 0, 0.25);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  }
`;

const AddNoteButton = styled(Button)`
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface NoteFormProps {
  onNoteSubmit: (noteTitle: string) => Promise<void>;
}

const NoteForm: React.FC<NoteFormProps> = ({ onNoteSubmit }) => {
  const [isSyncing, setSyncing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  const handleNoteTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (noteTitle.trim() === '') return;
    
    setSyncing(true);
    await onNoteSubmit(noteTitle);
    setSyncing(false);
    setNoteTitle('');
  };

  return (
    <NoteFormContainer onSubmit={handleSubmit}>
      <NoteInput
        rows={4}
        value={noteTitle}
        onChange={handleNoteTitleChange}
        placeholder="What's on your mind?"
      />
      <AddNoteButton type="submit" disabled={isSyncing}>
        {isSyncing ? (
          <>
            <LoadingSpinner />
            <span>Adding...</span>
          </>
        ) : (
          "Add Note"
        )}
      </AddNoteButton>
    </NoteFormContainer>
  );
};

export default NoteForm;