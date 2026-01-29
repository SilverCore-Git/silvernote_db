import { Router } from "express";
import { getDB } from "../../db";

const router = Router();

router.post('/add', async (req, res) => {
    const db = getDB();
    const visitors = db.collection('visitors');
    const { ip, path, timestamp } = req.body;
    await visitors.insertOne({ ip, path, timestamp });
    res.sendStatus(200);
});

router.get('/get', async (req, res) => {
    const db = getDB();
    const visitors = db.collection('visitors');
    const total = await visitors.countDocuments();
    const topPaths = await visitors.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]).toArray();

    res.json({ total, topPaths });
});


export default router;