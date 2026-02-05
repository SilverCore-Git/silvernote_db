import { Router } from "express";
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
router.get('/get/:uuid', async (req, res) => {
  try {
    const db = getDB();
    const note = await db.collection("notes").find({ uuid: req.params.uuid }).toArray();
    res.json(note);
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on notes get" });
  }
});


// get note by user id
router.get('/get/byuserid/:userid', async (req, res) => {
  try {
    const db = getDB();
    const note = await db.collection("notes").find({ user_id: req.params.userid }).toArray();
    res.json(note);
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on notes get" });
  }
});

// get with start and end index
router.get("/get/byuserid/:userid/WithIndex/:start/:end", async (req, res) => {

  try {

    const userId = req.params.userid;
    const start = parseInt(req.params.start) || 0;
    const end = parseInt(req.params.end) || 20;

    // Calcul du nombre d'éléments à récupérer
    // Exemple: de 0 à 10 = 10 éléments.
    const limit = Math.max(0, end - start); 
    const skip = Math.max(0, start);

    const db = getDB();
    const notes = await db.collection("notes")
      .find({ userId: userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // on renvoye aussi le total pour aider le front à gérer ses limites
    const totalNotes = await db.collection("notes").countDocuments({ userId: userId });

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
// router.post("/update", async (req, res) => {
//   try {
//     const note = req.body.note;
//     if (!note) return res.status(400).json({ error: "Missing body" });

//     const db = getDB();
//     await db.collection("notes").updateOne(
//       { uuid: note.uuid },
//       { $set: { ...note, lastSaveAt: new Date() } },
//       { upsert: true }
//     );

//     res.status(201).json({ uuid: note.uuid });
//   } catch (err:any) {
//     res.status(500).json({ error: true, state: "Error on note update", message: err.message || String(err) });
//     throw new Error(`"Error on note update : ${err}`);
//   }
// });

router.post("/update", async (req, res) => {
  try {
    const note = req.body.note;
    if (!note) return res.status(400).json({ error: "Missing body" });
    
    if (note._id) delete note._id;

    const db = getDB();
    const result = await db.collection("notes").updateOne(
      { uuid: note.uuid },
      { $set: { ...note, lastSaveAt: new Date() } },
      { upsert: true }
    );

    res.status(201).json({ uuid: note.uuid, _id: result.upsertedId });
  } catch (err:any) {
    res.status(500).json({ error: true, state: "Error on note update", message: err.message || String(err) });
    throw new Error(`"Error on note update : ${err}`);
  }
});


// delete a note by uuid
router.delete("/delete/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const db = getDB();
    const result = await db.collection("notes").deleteOne({ uuid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on delete" });
  }
});

// delete notes by user id
router.delete("/delete/byuserid/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const db = getDB();
    const result = await db.collection("notes").deleteMany({ user_id: userid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on delete" });
  }
});


export default router;
