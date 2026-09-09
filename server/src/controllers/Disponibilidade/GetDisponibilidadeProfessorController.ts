import type {
    Request,
    Response,
} from 'express';

import { AppError } from '../../errors/AppError';

import { GetDisponibilidadeProfessorService } from '../../services/Disponibilidade/GetDisponibilidadeProfessorService';

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
                return res
                    .status(403)
                    .json({
                        error:
                            'Acesso restrito a professores.',
                    });
            }

            const service =
                new GetDisponibilidadeProfessorService();

            const disponibilidades =
                await service.execute({
                    professorId:
                        req.professorId,
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

            if (
                error instanceof
                AppError
            ) {
                return res
                    .status(
                        error.statusCode
                    )
                    .json({
                        error:
                            error.message,
                    });
            }

            return res
                .status(500)
                .json({
                    error:
                        'Erro interno ao buscar disponibilidades.',
                });
        }
    }
}