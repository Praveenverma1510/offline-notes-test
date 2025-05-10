import axios from 'axios';
import {
  storeOfflineNote,
  getOfflineNote,
  getOfflineNotes,
  deleteOfflineNote,
  editOfflineNote
} from '../../public/indexeddb';

export interface Note {
  _id?: any; // Used by datastore
  localId?: string;

  localDeleteSynced?: boolean;
  localEditSynced?: boolean;
  noteData: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

function createServerNote(note: Note) {
  const serverNote: Note = {
    title: note.title,
    localId: note.localId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    noteData: note.noteData,
  }
  return serverNote
}

export function createNote(noteTitle: string) {
  const note: Note = {
    title: noteTitle,
    localId: crypto.randomUUID(),
    noteData: '',
    createdAt: new Date(), // Add the current timestamp
    updatedAt: new Date() // Add the updated timestamp
  };
  return note;
}

export async function submitNote(note: Note) {
  // Store the note in IndexedDB first
  // await storeOfflineNote(note);

  // Check if the browser is online
  if (navigator.onLine) {
    // Send a POST request to the save-note endpoint
    try {
      const response = await fetch('/api/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createServerNote(note)),
      });

      if (response.ok) {
        console.log('Note submitted successfully (API responded)');
        // await response.json().then(async (data) => {
          // TODO: Candidate should uncomment and potentially adjust this block
          //       once the backend API is implemented and returns a real database ID.
          //       This marks the note as synced by storing the backend ID locally.
          // note._id = data.insertedId;
          // await editOfflineNote(note);
        // });
        refreshNotes();
      } else {
        console.error('Failed to submit note');
      }
    } catch (error) {
      console.error('Failed to submit note:', error);
    }
  }
}

export async function deleteNote(noteId: string) {
  console.log("DELETE BUTTON CALLED", noteId)
  try {
    // Check if the browser is online
    if (navigator.onLine) {
      // If online, make a DELETE request to the API endpoint
      try {
        const response = await axios.delete(`/api/delete-note?id=${noteId}`);
        if (response.status === 200) {
          console.log("Note deleted successfully from the server.");
        }
      } catch (error) {
        console.error('Error deleting note from server:', error);
      }
    } else {
      const note = await getOfflineNote(noteId);

      if (note) {
        note.localDeleteSynced = false; // Mark as unsynced delete
        await editOfflineNote(note); // Update the offline storage with the delete status
        console.log("Note marked for delete in offline storage.");
      } else {
        console.error('Offline note not found.');
      }
    }
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
}

export async function editNote(noteId: string, updatedTitle: string) {
  console.log("EDITING BUTTON CALLED", noteId)
  try {
    if (navigator.onLine) {
      try {
        const response = await axios.put(`/api/edit-note?id=${noteId}`, { title: updatedTitle });
        const note = response.data;
        note.title = updatedTitle;
        note.localEditSynced = undefined;
        await editOfflineNote(note);
      } catch (error) {
        console.error('Error editing note:', error);
      }
    } else {
      const note = await getOfflineNote(noteId);
      if (note) {
        note.title = updatedTitle;
        await editOfflineNote(note);
      }
    }
  } catch (error) {
    console.error('Failed to edit note:', error);
  }
}

export async function updateSavedNote(serverNote: Note, localNotes: Note[]) {
  console.log('Updating saved note:', serverNote);
  const matchingSyncedLocalNote = localNotes.find(
    (localNote: Note) => localNote._id === serverNote._id
  );
  if (matchingSyncedLocalNote === undefined) {
    const matchingUnsyncedLocalNote = localNotes.find(
      (localNote: Note) => localNote.localId === serverNote.localId
    );
    if (matchingUnsyncedLocalNote !== undefined) {
      matchingUnsyncedLocalNote._id = serverNote._id;
      await editOfflineNote(matchingUnsyncedLocalNote);
    } else {
      serverNote.localId = crypto.randomUUID();
      await storeOfflineNote(serverNote);
    }
  }
}

export async function updateEditedNote(serverNote: Note, localNotes: Note[]) {
  const matchingLocalNote = localNotes.find((localNote: Note) => localNote._id === serverNote._id);
  if (matchingLocalNote !== undefined) {
    if (matchingLocalNote.localEditSynced === false) {
      await axios.put(`/api/edit-note?id=${matchingLocalNote._id}`, { title: matchingLocalNote.title });
      matchingLocalNote.localEditSynced = undefined;
      await editOfflineNote(matchingLocalNote);
    } else if (matchingLocalNote.localEditSynced === undefined) {
      matchingLocalNote.title = serverNote.title;
      await editOfflineNote(matchingLocalNote);
    }
  }
}

export async function updateDeletedNote(serverId: number, localNotes: Note[]) {
  const matchingLocalNote = localNotes.find((localNote: Note) => localNote._id === serverId);
  if (matchingLocalNote !== undefined) {
    await deleteOfflineNote(matchingLocalNote.localId);
  }
}

export async function refreshNotes() {
  if (navigator.onLine) {
    try {
      const response = await axios.get('/api/notes');
      const localNotes = response.data;
      const serverNotes = response.data;

      for (const localNote of localNotes) {
        if (localNote.localDeleteSynced === false) {
          const matchingServerNote = serverNotes.find((serverNote: Note) => localNote._id === serverNote._id);
          if (matchingServerNote !== undefined) {
            await deleteOfflineNote(localNote.localId);
            await axios.delete(`/api/delete-note?id=${localNote._id}`);
          }
        }
        else if (localNote._id === undefined) {
          // Attempt to submit unsynced local note
          try {
            // const submittedNoteResponse = await fetch('/api/save-note', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(createServerNote(localNote)),
            // });

            // if (submittedNoteResponse.ok) {
            //   console.log(`Synced local note ${localNote.localId} during refresh.`);
            //   // await submittedNoteResponse.json().then(async (data) => {
            //     // TODO: Candidate should uncomment and potentially adjust this block
            //     //       once the backend API is implemented and returns a real database ID.
            //     // localNote._id = data.insertedId;
            //     // await editOfflineNote(localNote);
            //   // });
            // } else {
            //    console.error(`Failed to sync local note ${localNote.localId} during refresh:`, submittedNoteResponse.statusText);
            // }
          } catch (error) {
            console.error(`Error syncing local note ${localNote.localId} during refresh:`, error);
          }
        }
      }

      const updatedLocalNotes = await getOfflineNotes();
      const updatedResponse = await axios.get('/api/notes');
      const updatedServerNotes = updatedResponse.data;

      for (const serverNote of updatedServerNotes) {
        console.log('Server note:', serverNote);
        updateSavedNote(serverNote, updatedServerNotes); // make sure to keep into account locally deleted notes
        // updateEditedNote(serverNote, updatedServerNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }
}

export async function getNotes() {
  // const notes = await getOfflineNotes();
  const data = await axios.get('/api/notes');
  const notes = data.data

  notes.sort(function (a: Note, b: Note) {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  return notes;
}