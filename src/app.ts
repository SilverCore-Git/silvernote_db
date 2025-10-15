import express from "express";
import { createServer } from "http";

import AuthMiddleware from "./middleware/Auth.js";

import notes from "./routes/notes";
import tags from "./routes/tags";

const httpServer = createServer();
const app = express();


app.use(AuthMiddleware);


app.use('/notes', notes);
app.use('/tags', tags);


httpServer.listen(3000, () => {
  console.log(`Serveur Express up`);
});