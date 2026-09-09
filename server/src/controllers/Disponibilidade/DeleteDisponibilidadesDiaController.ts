import type {
    Request,
    Response,
} from 'express';

import { DeleteDisponibilidadesDiaService } from '../../services/Disponibilidade/DeleteDisponibilidadesDiaService';

export class DeleteDisponibilidadesDiaController {
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

            const dataParam =
                req.params.data;

            const data =
                Array.isArray(
                    dataParam
                )
                    ? dataParam[0]
                    : dataParam;

            if (!data) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Data inválida. Utilize o formato YYYY-MM-DD.',
                    });
            }

            const service =
                new DeleteDisponibilidadesDiaService();

            const resultado =
                await service.execute({
                    professorId:
                        req.professorId,
                    data,
                });

            return res
                .status(200)
                .json(
                    resultado
                );
        } catch (error) {
            console.error(
                'Erro ao remover horários do dia:',
                error
            );

            if (
                error instanceof Error
            ) {
                let status =
                    400;

                if (
                    error.message ===
                    'Nenhum horário encontrado nesta data.'
                ) {
                    status = 404;
                }

                if (
                    error.message.includes(
                        'Existe uma aula agendada'
                    )
                ) {
                    status = 409;
                }

                return res
                    .status(status)
                    .json({
                        error:
                            error.message,
                    });
            }

            return res
                .status(500)
                .json({
                    error:
                        'Erro interno ao remover horários do dia.',
                });
        }
    }
}