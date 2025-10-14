import express from "express";
import httpServer from "httpServer";

import AuthMiddleware from "./middleware/Auth.js";

import push from "./routes/push";
import delete from "./routes/delete";
import get from "./routes/get";

const app = express();


app.use(AuthMiddleware);

// /push /delete /get
app.use('/push', push);
app.use('/delete', delete);
app.use('/get', get);



httpServer.listen(3000, () => {
  console.log(`Serveur Express + WebSocket sur le port 3000`);
});