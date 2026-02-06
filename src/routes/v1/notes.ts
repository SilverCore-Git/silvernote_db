import { Router, type Request, type Response } from "express";
import { getDB } from "../../db";

const router = Router();


// get all notes
router.get("/getall", async (req, res) => {
  try {
    const db = getDB();
    const notes = await db.collection("notes").find().toArray();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error on note get" });
  }
});

// get length
router.get("/length", async (req, res) => {
  try {
    const db = getDB();
    const length = await db.collection("notes").countDocuments();
    res.json({ length });
  } catch (err) {
    res.status(500).json({ error: "Error on get note length" });
  }
});


// get note by uuid
router.get('/user/:user_id/id/:uuid', async (req, res) => {

  const id = req.params.uuid;
  const user_id = req.params.user_id;

  try {
    const db = getDB();
    const notes = await db.collection("notes").find({ user_id: user_id, uuid: id }).toArray();
    res.json({ notes });
  } 
  catch (err:any) {
    res.status(500).json({
      error: true,
      message: err.message || String(err) || err.message, 
      state: "Error on notes get"
    });
  }

});


// get note by user id
router.get('/user/:user_id', async (req, res) => {

  try {

    const db = getDB();
    const notes = await db.collection("notes")
      .find({ user_id: req.params.user_id })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json({ notes });

  } 
  catch (err:any) {
    res.status(500).json({ 
      error: true,
      message: err.message || String(err) || err.message, 
      state: "Error on notes get" 
    });
  }

});


// get with start and end index
router.get("/user/:user_id/index/start/:start/end/:end", async (req, res) => {

  try {

    const user_id = req.params.user_id;
    const start = parseInt(req.params.start) || 0;
    const end = parseInt(req.params.end) || 20;

    // Calcul du nombre d'éléments à récupérer
    // Exemple: de 0 à 10 = 10 éléments.
    const limit = Math.max(0, end - start);
    const skip = Math.max(0, start);

    const db = getDB();

    const [ notes, totalNotes ] = await Promise.all([
      db.collection("notes")
        .find({ user_id: user_id })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("notes").countDocuments({ user_id: user_id })
    ]);

    res.json({
      notes,
      total: totalNotes,
      count: notes.length,
      range: { start, end }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching indexed notes" });
  }
  
});


// get user pinned notes
router.get('/user/:user_id/pinned', async (req: Request, res: Response) => {

  try {

    const user_id = req.params.user_id;

    const db = getDB();
    const notes = await db.collection("notes")
      .find({ user_id: user_id, pinned: true })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json({
      notes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching indexed notes" });
  }

});


// add a note
router.post("/push", async (req, res) => {
  try {
    const note = req.body.note;
    if (!note) return res.status(400).json({ error: "Missing body" });

    const db = getDB();
    const result = await db.collection("notes").insertOne({
      ...note,
      addedAt: new Date(),
      lastSaveAt: new Date(),
    });

    res.status(201).json({ uuid: note.uuid, _id: result.insertedId });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err), state: "Error on note push" });
  }
});


// update a note
router.post("/update", async (req, res) => {
  
  try {

    const note = req.body.note;
    if (!note) return res.status(400).json({ error: "Missing body" });
    
    if (note._id) delete note._id;

    const db = getDB();

    const result = await db.collection("notes").updateOne(
      { uuid: note.uuid, user_id: note.user_id },
      { $set: { 
        content: note.content, 
        title: note.title, 
        icon: note.icon, 
        tags: note.tags, 
        lastSaveAt: new Date() 
      } },
      { upsert: false }
    );

    res.status(201).json({ uuid: note.uuid, _id: result.upsertedId });

  }
  catch (err:any) {
    console.error("Note update Error : ", err);
    res.status(500).json({ 
      error: true, 
      state: "Error on note update", 
      message: err.message || String(err) 
    });
    throw new Error(`"Error on note update : ${err}`);
  }

});


// delete a note by uuid
router.delete("/delete/user/:user_id/id/:uuid", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const uuid = req.params.uuid;
    const db = getDB();
    const result = await db.collection("notes").deleteOne({ uuid, user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on delete" });
  }
});

// delete notes by user id
router.delete("/delete/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const db = getDB();
    const result = await db.collection("notes").deleteMany({ user_id: user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on delete" });
  }
});


export default router;
