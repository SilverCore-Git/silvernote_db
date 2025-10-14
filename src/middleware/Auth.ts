import type { NextFunction, Request, Response } from 'express';
import 'dotenv';

const API_SK = process.env.API_SK

export default function AuthMiddleware(
    req: Request, 
    res: Response, 
    next: NextFunction
) 
{

    const client_api_sk = req.headers['Authorisation'];
    const client_data = {
        "for": req.path,
        "by": req.ip,
        "date": new Date().toString
    };

    if (client_api_sk === API_SK) 
    {
        console.log("Nouvelle acces authantifier :", client_data);
        return next();
    }
    else
    {
        console.log('Acces non authantifier :', client_data);
        return res.json({ error: true, message: "auth failed, sk didn't match." });
    }

};