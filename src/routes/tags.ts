import { Router } from "express";
import { getDB } from "../db";

const router = Router();


// get all tags
router.get("/getall", async (req, res) => {
  try {
    const db = getDB();
    const tags = await db.collection("tags").find().toArray();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Error on tag get" });
  }
});


// get tag by uuid
router.get('/get/:uuid', async (req, res) => {
  try {
    const db = getDB();
    const tag = await db.collection("tags").find({ uuid: req.params.uuid }).toArray();
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: "Error on tags get" });
  }
});



// add a tag
router.post("/push", async (req, res) => {
  try {
    const tag = req.body.tag;
    if (!tag) return res.status(400).json({ error: "Missing body" });

    const db = getDB();
    const result = await db.collection("tags").insertOne({
      ...tag,
      addedAt: new Date(),
      lastSaveAt: new Date(),
    });

    res.status(201).json({ uuid: tag.uuid, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Error on tag push" });
  }
});


// update a tag
router.post("/update", async (req, res) => {
  try {
    const tag = req.body.tag;
    if (!tag) return res.status(400).json({ error: "Missing body" });

    const db = getDB();
    const result = await db.collection("tags").updateOne(
      { uuid: tag.uuid },
      { $set: { ...tag, lastSaveAt: new Date() } },
      { upsert: true }
    );

    res.status(201).json({ uuid: tag.uuid, _id: result.upsertedId });
  } catch (err) {
    res.status(500).json({ error: "Error on tag update" });
  }
});


// delete a tag by uuid
router.delete("/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const db = getDB();
    const result = await db.collection("tags").deleteOne({ uuid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "tag not found" });
    }

    res.json({ message: "tag deleted with success" });
  } catch (err) {
    res.status(500).json({ error: "Error on delete" });
  }
});


export default router;
