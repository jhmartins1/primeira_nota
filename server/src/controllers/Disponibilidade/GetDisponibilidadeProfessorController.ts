import type {
    Request,
    Response,
} from 'express';

import { prisma } from '../../prisma/client';

export class GetDisponibilidadeProfessorController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            if (
                req.tipoConta !==
                'professor' ||
                !req.professorId
            ) {
                return res.status(403).json({
                    error:
                        'Acesso restrito a professores.',
                });
            }

            const agora =
                new Date();

            const disponibilidades =
                await prisma.disponibilidade.findMany({
                    where: {
                        professorId:
                            req.professorId,

                        horaInicio: {
                            gte:
                                agora,
                        },
                    },

                    orderBy: {
                        horaInicio:
                            'asc',
                    },
                });

            return res
                .status(200)
                .json(
                    disponibilidades
                );
        } catch (error) {
            console.error(
                'Erro ao buscar disponibilidades:',
                error
            );

            return res.status(500).json({
                error:
                    'Erro interno ao buscar disponibilidades.',
            });
        }
    }
}