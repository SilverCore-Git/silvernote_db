import type { NextFunction, Request, Response } from 'express';


export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
        
    const apiKey1 = req.headers['authorization'];
    const apiKey2 = req.headers['x-api-key'];

    const API_SK_1 = process.env.API_SK_1;
    const API_SK_2 = process.env.API_SK_2;

    const client_data = {
        path: req.path,
        ip: req.ip,
        date: new Date().toISOString(),
    };

    if (!apiKey1 || !apiKey2) {
        return res.status(401).json({ error: true, message: 'Missing API keys' });
    }

    if (!API_SK_1 || !API_SK_2) {
        console.error('Missing server API keys in environment');
        return res.status(500).json({ error: true, message: 'Server misconfigured' });
    }

    const authOk = apiKey1 === API_SK_1 && apiKey2 === API_SK_2;

    if (!authOk) {
        console.warn('Unauthorized access attempt:', client_data);
        return res.status(403).json({ error: true, message: "Authentication failed" });
    }

    next();

}
