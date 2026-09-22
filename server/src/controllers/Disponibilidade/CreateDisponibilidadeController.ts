import type {
    Request,
    Response,
} from 'express';

import { AppError } from '../../errors/AppError';

import { CreateDisponibilidadeService } from '../../services/Disponibilidade/CreateDisponibilidadeService';

export class CreateDisponibilidadeController {
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

            const {
                dataInicial,
                horarios,
                repetirSeteDiasUteis =
                false,
            } = req.body;

            const service =
                new CreateDisponibilidadeService();

            const resultado =
                await service.execute({
                    professorId:
                        req.professorId,
                    dataInicial,
                    horarios,
                    repetirSeteDiasUteis,
                });

            return res
                .status(201)
                .json(resultado);
        } catch (error) {
            console.error(
                'Erro ao criar disponibilidades:',
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
                        'Erro interno ao criar disponibilidades.',
                });
        }
    }
}