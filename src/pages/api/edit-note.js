import clientPromise from '../../../public/mongodb'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query; // ID of the note to edit (likely localId stored as _id by client)
      const { title: noteTitle } = req.body; // New title

      if (!id || typeof noteTitle !== 'string') {
        return res.status(400).json({ error: 'Missing note ID or title' });
      }

      // TODO: Implement logic to update the note in your chosen data store.
      // - Connect to the database/data source.
      // - Find the note by its unique identifier (`id`).
      // - Update the note's title to `noteTitle`.
      // - Handle the case where the note is not found.
      // - Replace the example response below.

      const noteFound = true; // Placeholder
      const client = await clientPromise;
      const db = client.db('notes');
      const collection = db.collection('notes');

      const existingNote = await collection.findOne({ _id: new ObjectId(id) });

      if (existingNote) {
        const updated = await collection.updateOne(
          { _id: new ObjectId(id) },
          { 
            $set: { 
              title: noteTitle, 
              updatedAt: new Date() 
            }
          }
        );

        if (updated.matchedCount > 0) {
          res.status(200).json({ message: 'Note edited successfully' });
        } else {
          res.status(404).json({ error: 'Note not found' });
        }
      } else {
        const newNote = await collection.insertOne({
          title: noteTitle,
          // noteData: noteTitle || "",
          createdAt: new Date(), // This will be the timestamp of the new note
          updatedAt: new Date()  // Same timestamp for initial update
        });

        res.status(201).json({
          message: 'New note created successfully',
          id: newNote.insertedId
        });
      }
    } catch (error) {
      console.error('Error editing note:', error);
      res.status(500).json({ error: 'Failed to edit note' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}