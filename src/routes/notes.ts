import { Router } from "express";
import { getDB } from "../db";

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

    const db = getDB();
    await db.collection("notes").updateOne(
      { uuid: note.uuid },
      { $set: { ...note, lastSaveAt: new Date() } },
      { upsert: true }
    );

    res.status(201).json({ uuid: note.uuid });
  } catch (err:any) {
    res.status(500).json({ error: true, state: "Error on note update", message: err.message || String(err) });
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
