import clientPromise from '../../../public/mongodb'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const noteData = req.body;

      // Basic validation (optional, but good practice)
      if (!noteData || !noteData.title || !noteData.localId || !noteData.createdAt) {
        return res.status(400).json({ error: 'Invalid note data' });
      }

      

      // TODO: Implement logic to save the note to your chosen data store.
      // - Connect to the database/data source.
      // - Save the noteData object.
      // - Retrieve the unique identifier assigned by the data store (e.g., MongoDB _id, SQL primary key).
      // - Replace the example response below with the actual assigned identifier.

      const client = await clientPromise;
      const db = client.db('notes');
      const collection = db.collection('notes');

    
      // const insertedId = noteData.localId; // Placeholder: Use localId as temporary example ID
      const newPost = await collection.insertOne({ 
        title: noteData.title,
        // noteData: noteData.noteData || "",
        // localId: noteData.localId,
        createdAt: new Date(noteData.createdAt),
        updatedAt: new Date()
      })
      res.status(201).json({
        id: newPost.insertedId,
        // localId: noteData.localId
      })

      // Respond with the identifier the client expects
      // res.status(200).json({ insertedId: insertedId });
    } catch (error) {
      console.error('Error saving note:', error);
      res.status(500).json({ error: 'Failed to save note' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}