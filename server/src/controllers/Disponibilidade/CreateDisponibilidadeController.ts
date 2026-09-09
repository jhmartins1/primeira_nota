import type {
    Request,
    Response,
} from 'express';

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
                repetirProximos14Dias =
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
                    repetirProximos14Dias,
                });

            return res
                .status(201)
                .json(
                    resultado
                );
        } catch (error) {
            console.error(
                'Erro ao criar disponibilidades:',
                error
            );

            if (
                error instanceof
                Error
            ) {
                return res
                    .status(400)
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