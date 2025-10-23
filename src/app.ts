import express, { Request, Response } from "express";
import morgan from "morgan";
import 'dotenv/config';

import AuthMiddleware from "./middleware/Auth";

import notes from "./routes/notes";
import tags from "./routes/tags";
import { SilverIssueMiddleware } from "./lib/silverissue";
import { connectDB, getDB } from "./db";

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(SilverIssueMiddleware);
app.use(AuthMiddleware);


app.use('/notes', notes);
app.use('/tags', tags);

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