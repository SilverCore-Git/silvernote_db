import { Router } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { File } from "../assets/database/dbTypes";
import db from '../assets/database/FileDb';

const router = Router();

const dataDir: string = path.join(__dirname, '../db_file');
const uploadDir: string = path.join(__dirname, '../temp');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024 * 1024 // 1 Go
    }
});


router.post('/upload', upload.single('file'), async (req, res) => {

    if (!req.file) return res.status(400).json({ error: true, message: 'No file found' });

    const UUID: string = randomUUID();
    const file: File = {
        UUID,
        filePath: path.join(dataDir, `${UUID}.${path.extname(req.file.originalname)}`),
        size: req.file.size
    };

    db.push(file);

    await fs.promises.copyFile(
        req.file.path,
        file.filePath
    );

    fs.rmSync(req.file.path);

    res.json({
        success: true,
        file,
        url: `https://db.silvernote.fr/file/see/${UUID}`
    });

})


router.get('/see/:uuid', async (req, res) => {

    const file: File | undefined = await db.get(String(req.params.uuid));
    if (!file) return res.status(404).json({ error: true, message: 'file does not exist !' });

    if (!fs.existsSync(file?.filePath)) res.status(404).json({ error: true, message: 'file does not exist !' });

    res.sendFile(file.filePath);

})


export default router;