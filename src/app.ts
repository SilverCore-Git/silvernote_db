import express from "express";
import httpServer from "httpServer";

import AuthMiddleware from "./middleware/Auth.js";

const app = express();


app.use(AuthMiddleware);

// /push /delete /get




httpServer.listen(3000, () => {
  console.log(`Serveur Express + WebSocket sur le port 3000`);
});