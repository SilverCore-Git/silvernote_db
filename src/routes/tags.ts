import { Router } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";

const router = Router();

// 📄 GET — Récupérer toutes les tags
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const tags = await db.collection("tags").find().toArray();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des tags" });
  }
});

// ➕ POST — Ajouter une note
router.post("/new", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Champs manquants" });

    const db = getDB();
    const result = await db.collection("tags").insertOne({
      title,
      content,
      createdAt: new Date(),
    });

    res.status(201).json({ _id: result.insertedId, title, content });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l’ajout de la note" });
  }
});

router.post("/update", async (req, res) => {

});

// ❌ DELETE — Supprimer une note
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const result = await db.collection("tags").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    res.json({ message: "Note supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;
