import type {
    Request,
    Response,
} from 'express';

import {
    HORARIOS_DISPONIVEIS,
} from '../../utils/horarios';

import {
    RemarcarAgendamentoProfessorService,
} from '../../services/Agendamento/RemarcarAgendamentoProfessorService';

export class RemarcarAgendamentoProfessorController {
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

            const professorId =
                req.professorId;

            const agendamentoId =
                Number(
                    req.params.id
                );

            if (
                !Number.isInteger(
                    agendamentoId
                ) ||
                agendamentoId <=
                0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'ID do agendamento inválido.',
                    });
            }

            const {
                data,
                horario,
            } =
                req.body;

            if (
                typeof data !==
                'string' ||
                typeof horario !==
                'string'
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'data e horario são obrigatórios.',
                    });
            }

            const regexData =
                /^\d{4}-\d{2}-\d{2}$/;

            if (
                !regexData.test(
                    data
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Formato de data inválido. Use YYYY-MM-DD.',
                    });
            }

            const regexHorario =
                /^\d{2}:\d{2}$/;

            if (
                !regexHorario.test(
                    horario
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Formato de horário inválido. Use HH:mm.',
                    });
            }

            if (
                !HORARIOS_DISPONIVEIS.includes(
                    horario
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Horário não permitido para agendamento.',
                    });
            }

            const service =
                new RemarcarAgendamentoProfessorService();

            const agendamento =
                await service.execute({
                    professorId,
                    agendamentoId,
                    data,
                    horario,
                });

            return res
                .status(200)
                .json({
                    message:
                        'Aula remarcada com sucesso.',

                    agendamento,
                });
        } catch (
        error
        ) {
            console.error(
                '========================================'
            );

            console.error(
                'ERRO REMARCAÇÃO PROFESSOR:'
            );

            console.error(
                error
            );

            console.error(
                '========================================'
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
                        'Erro interno do servidor.',
                });
        }
    }
}