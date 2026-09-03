import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

declare global {
    namespace Express {
        interface Request {
            clerkId?: string;
        }
    }
}

export async function clerkIdentifyOnly(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token não fornecido',
            });
        }

        const token = authHeader.replace('Bearer ', '');

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        req.clerkId = payload.sub;

        next();
    } catch (error) {
        console.error('ERRO AO IDENTIFICAR TOKEN:', error);

        return res.status(401).json({
            error: 'Token inválido',
        });
    }
}