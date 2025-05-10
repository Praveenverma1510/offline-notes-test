import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Note, createNote, submitNote, deleteNote, editNote, refreshNotes, getNotes } from '../utils/notes';
import NoteForm from './NoteForm';
import NoteItem from './NoteItem';
import OfflineIndicator from './OfflineIndicator';
import { SpinnerContainer } from './LoadingSpinner';

const NotesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 10px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: bottom;
    z-index: 0;

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`;

const NoteListWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(99, 102, 241, 0.5);
  position: relative;
  
  &::after {
    content: '';
    display: block;
    height: 4px;
    background: azure;
    margin: 0.5rem auto 0;
    border-radius: 2px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FilterInput = styled.input`
  flex: 1;
  padding: 0.8rem 1.2rem;
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

const FilterSelect = styled.select`
  padding: 0.8rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(0, 0, 0, 0.25);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  }
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LoadingSpinner = styled(SpinnerContainer)`
  margin: 3rem auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-top: 1rem;
`;

export default function NoteList() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'synced' | 'unsynced'>('all');

  const handleNoteSubmit = useCallback(async (noteTitle: string) => {
    if (noteTitle != '') {
      const note: Note = createNote(noteTitle);
      await submitNote(note);
      setAllNotes(await getNotes());
    }
  }, []);

  const handleNoteDelete = useCallback(async (noteId: string) => {
    await deleteNote(noteId);
    setAllNotes(await getNotes());
  }, []);

  const handleEditNote = useCallback(async (noteId: string, updatedTitle: string) => {
    console.log("EDITING BUTTON CALLED APIII")
    await editNote(noteId, updatedTitle);
    setAllNotes(await getNotes());
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      await refreshNotes();
      const notes = await getNotes();
      console.log('Fetched notes:', notes);
      setAllNotes(notes);
      setFilteredNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { type: 'module' })
        .then((registration) => {
          console.log('Service Worker registered:', registration);
  
          window.addEventListener('online', async () => {
            registration.sync.register('sync-notes')
              .then(() => {
                console.log('Sync event registered');
              })
              .catch((error) => {
                console.error('Sync event registration failed:', error);
              });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    window.addEventListener('online', async () => {
      await fetchNotes();
    });

    return () => {
      window.removeEventListener('online', async () => {
        await fetchNotes();
      });
    };
  }, [fetchNotes]);

  useEffect(() => {
    let result = allNotes;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus === 'synced') {
      result = result.filter(note => note._id !== undefined);
    } else if (filterStatus === 'unsynced') {
      result = result.filter(note => note._id === undefined ||
        note.localDeleteSynced === false ||
        note.localEditSynced === false);
    }
    
    setFilteredNotes(result);
  }, [allNotes, searchTerm, filterStatus]);

  return (
    <NotesContainer>
      <NoteListWrapper>
        <Header>My Notes</Header>

        <NoteForm onNoteSubmit={handleNoteSubmit} />

        
        <FilterContainer>
          <FilterInput
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <FilterSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'synced' | 'unsynced')}
          >
            <option value="all">All Notes</option>
            <option value="synced">Synced</option>
            <option value="unsynced">Unsynced</option>
          </FilterSelect> */}
        </FilterContainer>


        {loading ? (
          <LoadingSpinner />
        ) : (
          <NotesList>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => (
                <NoteItem
                  key={index}
                  note={note}
                  onDeleteNote={handleNoteDelete}
                  onEditNote={handleEditNote}
                />
              ))
            ) : (
              <EmptyState>
                {searchTerm || filterStatus !== 'all'
                  ? "No notes match your filters"
                  : "No notes yet. Add one above!"}
              </EmptyState>
            )}
          </NotesList>
        )}
      </NoteListWrapper>
      <OfflineIndicator />
    </NotesContainer>
  );
}