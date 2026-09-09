import type {
    Request,
    Response,
} from 'express';

import { AppError } from '../../errors/AppError';

import { DeleteDisponibilidadeService } from '../../services/Disponibilidade/DeleteDisponibilidadeService';

export class DeleteDisponibilidadeController {
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

            const { id } =
                req.params;

            const disponibilidadeId =
                Number(id);

            const service =
                new DeleteDisponibilidadeService();

            await service.execute({
                professorId:
                    req.professorId,
                disponibilidadeId,
            });

            return res
                .status(204)
                .send();
        } catch (error) {
            console.error(
                'Erro ao remover disponibilidade:',
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
                        'Erro interno ao remover disponibilidade.',
                });
        }
    }
}