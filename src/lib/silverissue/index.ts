import { ErrorRequestHandler } from "express";
import { Webhook } from "./src/webhook";

const webhook = new Webhook('https://discord.com/api/webhooks/1430904661434433608/JO-ydmTR3ujiIZxoChyp8QOKS92vG2XjXzgqhvQIfn03NiNDCzLYYwgMvuU1oWJYLHDp');

process.on("uncaughtException", async (error) => {
    console.error("Erreur non gérée :", error);
    await webhook.sendError(error, "uncaughtException");
});

process.on("unhandledRejection", async (reason) => {
    console.error("Rejet non géré :", reason);
    await webhook.sendError(reason, "unhandledRejection");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
    webhook.sendError(err, `Route : ${req.method} ${req.url}`);
    next();
}

export {
    webhook,
    errorHandler as SilverIssueMiddleware
}