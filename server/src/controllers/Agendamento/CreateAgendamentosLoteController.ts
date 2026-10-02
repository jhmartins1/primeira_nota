import type {
    Request,
    Response,
} from 'express';

import {
    CreateAgendamentosLoteService,
} from '../../services/Agendamento/CreateAgendamentosLoteService';

export class CreateAgendamentosLoteController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            if (!req.usuarioId) {
                return res.status(401).json({
                    error:
                        'Usuário não autenticado.',
                });
            }

            const usuarioId =
                req.usuarioId;

            const {
                professorId,
                instrumentoId,
                nivelId,
                datasHora,
            } = req.body;

            if (
                !professorId ||
                !instrumentoId ||
                !nivelId ||
                !Array.isArray(
                    datasHora
                ) ||
                datasHora.length === 0
            ) {
                return res.status(400).json({
                    error:
                        'professorId, instrumentoId, nivelId e datasHora são obrigatórios.',
                });
            }

            const datas =
                datasHora.map(
                    (item: unknown) =>
                        new Date(
                            String(item)
                        )
                );

            const possuiDataInvalida =
                datas.some(
                    (data) =>
                        isNaN(
                            data.getTime()
                        )
                );

            if (
                possuiDataInvalida
            ) {
                return res.status(400).json({
                    error:
                        'Uma ou mais datas são inválidas.',
                });
            }

            const service =
                new CreateAgendamentosLoteService();

            const agendamentos =
                await service.execute({
                    usuarioId,

                    professorId:
                        Number(
                            professorId
                        ),

                    instrumentoId:
                        Number(
                            instrumentoId
                        ),

                    nivelId:
                        Number(
                            nivelId
                        ),

                    datasHora:
                        datas,
                });

            return res
                .status(201)
                .json(
                    agendamentos
                );
        } catch (error) {
            console.error(
                'Erro ao criar agendamentos em lote:',
                error
            );

            if (
                error instanceof Error
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
                        'Erro interno do servidor.',
                });
        }
    }
}