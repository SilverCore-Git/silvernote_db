import express, { Request, Response } from "express";
import morgan from "morgan";
import 'dotenv/config';

import AuthMiddleware from "./middleware/Auth";

import notes from "./routes/v1/notes";
import tags from "./routes/v1/tags";
import visitors from "./routes/v1/visitors";
import { SilverIssueMiddleware } from "./lib/silverissue";
import { connectDB, getDB } from "./db";
import file from './routes/v1/file';

const app = express();

app.use(express.json({ limit: "1000mb" }));
app.use(morgan('dev'));
app.use(SilverIssueMiddleware);
app.use(AuthMiddleware);


app.use('/notes', notes);
app.use('/tags', tags);
app.use('/visitors', visitors);
app.use('/file', file);

app.use('/v1/notes', notes);
app.use('/v1/tags', tags);
app.use('/v1/visitors', visitors);
app.use('/v1/file', file);

app.get('/ping', (req, res) => {
  const db = getDB();
  res.json(db.command({ ping: 1 }));
})


app.use((req: Request, res: Response) => {
  res.status(404).json({ error:true, message: '404' });
})


app.listen(4587, async () => {
  console.log(`Serveur Express up on localhost:4587`);
  await connectDB();
});