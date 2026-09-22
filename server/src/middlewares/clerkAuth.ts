import type {
    Request,
    Response,
    NextFunction,
} from 'express';

import { verifyToken } from '@clerk/backend';

import { prisma } from '../prisma/client';

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
            professorId?: number;
            tipoConta?:
            | 'usuario'
            | 'professor';
        }
    }
}

export async function clerkAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith(
                'Bearer '
            )
        ) {
            return res
                .status(401)
                .json({
                    error:
                        'Token não fornecido',
                });
        }

        const token =
            authHeader.replace(
                'Bearer ',
                ''
            );

        const payload =
            await verifyToken(
                token,
                {
                    secretKey:
                        process.env
                            .CLERK_SECRET_KEY,
                }
            );

        const clerkId =
            payload.sub;

        if (!clerkId) {
            return res
                .status(401)
                .json({
                    error:
                        'Token sem identificação de usuário',
                });
        }

        // ==========================================
        // 1. PROFESSOR TEM PRIORIDADE
        // ==========================================

        const professor =
            await prisma.professor.findUnique(
                {
                    where: {
                        clerkId,
                    },
                }
            );

        if (professor) {
            req.professorId =
                professor.id;

            req.tipoConta =
                'professor';

            return next();
        }

        // ==========================================
        // 2. SE NÃO FOR PROFESSOR, PROCURA USUÁRIO
        // ==========================================

        const usuario =
            await prisma.usuario.findUnique(
                {
                    where: {
                        clerkId,
                    },
                }
            );

        if (usuario) {
            req.usuarioId =
                usuario.id;

            req.tipoConta =
                'usuario';

            return next();
        }

        // ==========================================
        // 3. NENHUMA CONTA ENCONTRADA
        // ==========================================

        return res
            .status(404)
            .json({
                error:
                    'Conta não encontrada',
            });
    } catch (error) {
        console.error(
            'ERRO DETALHADO NA AUTENTICAÇÃO:',
            error
        );

        return res
            .status(401)
            .json({
                error:
                    'Token inválido',
            });
    }
}