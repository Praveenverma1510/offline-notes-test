import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SyncIndicator from './SyncIndicator';
import { Note } from '../utils/notes';
import { Button } from '../styles/styled';

const NoteItemWrapper = styled.div`
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const NoteFrame = styled.li<{ isSubmitted?: boolean }>`
  position: relative;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${props => props.isSubmitted
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 245, 157, 0.15)'};
  backdrop-filter: blur(16px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    background: ${props => props.isSubmitted
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(255, 245, 157, 0.2)'};
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.isSubmitted
    ? 'linear-gradient(to bottom, #6366f1, #8b5cf6)'
    : 'linear-gradient(to bottom, #f59e0b, #f97316)'};
  }
`;

const NoteTimestamp = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const NoteContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #ffffff;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #34d399);

`;

const EditButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6, #6366f1);
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #6b7280, #4b5563);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: scale(1.1);
  }
`;

const OfflineIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const OfflineIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: rgba(239, 68, 68, 0.15);
  border-radius: 8px;
  font-size: 0.8rem;
  color: #ef4444;
`;

interface NoteItemProps {
  note: Note;
  onDeleteNote: (noteId: string) => Promise<void>;
  onEditNote: (noteId: string, updatedTitle: string) => Promise<void>;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDeleteNote, onEditNote }) => {
  const [isSyncing, setSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async () => {
    setSyncing(true);
    try {
      if (note._id !== undefined) {
        await onDeleteNote(note._id);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTitle(note.title);
  };

  const handleSave = async () => {
    console.log('Saving note:', note, title);
    if (note._id !== undefined) {
      setSyncing(true);
      await onEditNote(note._id, title);
      setSyncing(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(note.title);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, title]);

  return (
    <NoteItemWrapper>
      <NoteFrame isSubmitted={note._id !== undefined}>
        {isSyncing && <SyncIndicator />}
        <DeleteButton onClick={handleDelete}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#ef4444" />
          </svg>
        </DeleteButton>
        
        <NoteTimestamp>
          {new Date(note?.createdAt).toLocaleString()}
        </NoteTimestamp>
        
        {isEditing ? (
          <EditTextarea
            ref={textareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <NoteContent>{note.title}</NoteContent>
        )}
        
        {isEditing ? (
          <ButtonGroup>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </ButtonGroup>
        ) : (
          <EditButton onClick={handleEdit}>Edit</EditButton>
        )}
      </NoteFrame>
      
      {(note.localDeleteSynced === false || note.localEditSynced === false || note._id === undefined) && (
        <OfflineIndicatorWrapper>
          {note.localDeleteSynced === false && (
            <OfflineIndicator>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444" />
              </svg>
              <span>Note deletion pending sync</span>
            </OfflineIndicator>
          )}
          {note.localEditSynced === false && (
            <OfflineIndicator>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444" />
              </svg>
              <span>Note edit pending sync</span>
            </OfflineIndicator>
          )}
          {note._id === undefined && (
            <OfflineIndicator>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444" />
              </svg>
              <span>Note creation pending sync</span>
            </OfflineIndicator>
          )}
        </OfflineIndicatorWrapper>
      )}
    </NoteItemWrapper>
  );
};

export default NoteItem;