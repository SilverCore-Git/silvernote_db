import { Router } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";

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
  } catch (err) {
    res.status(500).json({ error: "Error on notes get" });
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
  } catch (err) {
    res.status(500).json({ error: "Error on note push" });
  }
});


// update a note
router.post("/update", async (req, res) => {
  try {
    const note = req.body.note;
    if (!note) return res.status(400).json({ error: "Missing body" });

    const db = getDB();
    const result = await db.collection("notes").updateOne(
      { uuid: note.uuid },
      { $set: { ...note, lastSaveAt: new Date() } },
      { upsert: true }
    );

    res.status(201).json({ uuid: note.uuid, _id: result.upsertedId });
  } catch (err) {
    res.status(500).json({ error: "Error on note update" });
  }
});


// ❌ DELETE — Supprimer une note
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const result = await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    res.json({ message: "Note supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;
