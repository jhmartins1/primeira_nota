import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { prisma } from '../prisma/client';

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
        }
    }
}

export async function clerkAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        console.log('Authorization recebido:', !!authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token não fornecido',
            });
        }

        const token = authHeader.replace('Bearer ', '');

        console.log('Token recebido:', !!token);

        console.log(
            'CLERK_SECRET_KEY carregada:',
            !!process.env.CLERK_SECRET_KEY
        );

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        console.log('Token Clerk válido!');
        console.log('Clerk User ID:', payload.sub);

        const usuario = await prisma.usuario.findUnique({
            where: {
                clerkId: payload.sub,
            },
        });

        if (!usuario) {
            console.log(
                'Usuário Clerk não encontrado no banco:',
                payload.sub
            );

            return res.status(404).json({
                error: 'Usuário não encontrado',
            });
        }

        req.usuarioId = usuario.id;

        next();
    } catch (error) {
        console.error('ERRO DETALHADO NA AUTENTICAÇÃO:', error);

        return res.status(401).json({
            error: 'Token inválido',
        });
    }
}