import { Router } from "express";
import { getDB } from "../db";

const router = Router();


// get all tags
router.get("/getall", async (req, res) => {
  try {
    const db = getDB();
    const tags = await db.collection("tags").find().toArray();
    res.json(tags);
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err), state: "Error on tag get" });
  }
});


// get tag by uuid
router.get('/get/:uuid', async (req, res) => {
  try {
    const db = getDB();
    const tag = await db.collection("tags").find({ uuid: req.params.uuid }).toArray();
    res.json(tag);
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err), state: "Error on tags get" });
  }
});


// get tag by user id
router.get('/get/byuserid/:userid', async (req, res) => {
  try {
    const db = getDB();
    const note = await db.collection("tags").find({ user_id: req.params.userid }).toArray();
    res.json(note);
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on tags get" });
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
      addedAt: new Date().getDate(),
      lastSaveAt: new Date().getDate(),
    });

    res.status(201).json({ uuid: tag.uuid, _id: result.insertedId });
  } catch (err:any) {
    res.status(500).json({ error: true, state: "Error on tag push", message: err.message || String(err) });
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
      { $set: { ...tag, lastSaveAt: new Date().getDate() } },
      { upsert: true }
    );

    res.status(201).json({ uuid: tag.uuid, _id: result.upsertedId });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err), state: "Error on tag update" });
  }
});


// delete a tag by uuid
router.delete("/delete/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const db = getDB();
    const result = await db.collection("tags").deleteOne({ uuid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "tag not found" });
    }

    res.json({ message: "tag deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err), state: "Error on delete" });
  }
});

// delete tags by user id
router.delete("/delete/byuserid/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const db = getDB();
    const result = await db.collection("tags").deleteMany({ user_id: userid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Tag not found" });
    }

    res.json({ success: true, message: "Tag deleted with success" });
  } catch (err:any) {
    res.status(500).json({ error: true, message: err.message || String(err) || err.message, state: "Error on delete" });
  }
});


export default router;
