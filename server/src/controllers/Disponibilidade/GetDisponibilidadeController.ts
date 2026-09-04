import type {
    Request,
    Response,
} from 'express';

import { GetDisponibilidadeService } from '../../services/Disponibilidade/GetDisponibilidadeService';

export class GetDisponibilidadeController {
    private service:
        GetDisponibilidadeService;

    constructor() {
        this.service =
            new GetDisponibilidadeService();
    }

    async handle(
        req: Request,
        res: Response
    ) {
        try {
            const idParam =
                req.params.id;

            const id =
                Array.isArray(
                    idParam
                )
                    ? idParam[0]
                    : idParam;

            const professorId =
                Number(id);

            if (
                !professorId ||
                Number.isNaN(
                    professorId
                ) ||
                professorId <= 0
            ) {
                return res.status(400).json({
                    error:
                        'ID do professor inválido.',
                });
            }

            const diasParamRaw =
                req.query.dias;

            const diasParam =
                Array.isArray(
                    diasParamRaw
                )
                    ? diasParamRaw[0]
                    : diasParamRaw;

            const dias =
                diasParam
                    ? Number(
                        diasParam
                    )
                    : 7;

            if (
                Number.isNaN(
                    dias
                ) ||
                dias < 1 ||
                dias > 30
            ) {
                return res.status(400).json({
                    error:
                        'O parâmetro dias deve estar entre 1 e 30.',
                });
            }

            const horarios =
                await this.service.execute({
                    professorId,
                    dias,
                });

            return res
                .status(200)
                .json(
                    horarios
                );
        } catch (error) {
            console.error(
                'Erro ao buscar horários disponíveis:',
                error
            );

            return res.status(500).json({
                error:
                    'Erro interno ao buscar horários disponíveis.',
            });
        }
    }
}