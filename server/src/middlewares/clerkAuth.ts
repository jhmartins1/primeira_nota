import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { prisma } from '../prisma/client';

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
            professorId?: number;
            tipoConta?: 'usuario' | 'professor';
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

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token não fornecido',
            });
        }

        const token = authHeader.replace('Bearer ', '');

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        // Tenta primeiro como aluno
        const usuario = await prisma.usuario.findUnique({
            where: { clerkId: payload.sub },
        });

        if (usuario) {
            req.usuarioId = usuario.id;
            req.tipoConta = 'usuario';
            return next();
        }

        // Se não é aluno, tenta como professor
        const professor = await prisma.professor.findUnique({
            where: { clerkId: payload.sub },
        });

        if (professor) {
            req.professorId = professor.id;
            req.tipoConta = 'professor';
            return next();
        }

        return res.status(404).json({
            error: 'Conta não encontrada',
        });
    } catch (error) {
        console.error('ERRO DETALHADO NA AUTENTICAÇÃO:', error);

        return res.status(401).json({
            error: 'Token inválido',
        });
    }
}