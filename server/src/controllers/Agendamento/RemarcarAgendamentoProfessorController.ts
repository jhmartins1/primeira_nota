import type {
    Request,
    Response,
} from 'express';

import {
    RemarcarAgendamentoProfessorService,
} from '../../services/Agendamento/RemarcarAgendamentoProfessorService';

export class RemarcarAgendamentoProfessorController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            // ----------------------------------------------------
            // 1. AUTENTICAÇÃO / TIPO DE CONTA
            // ----------------------------------------------------

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

            // ----------------------------------------------------
            // 2. ID DO AGENDAMENTO
            // ----------------------------------------------------

            const agendamentoId =
                Number(
                    req.params.id
                );

            if (
                !Number.isInteger(
                    agendamentoId
                ) ||
                agendamentoId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'ID do agendamento inválido.',
                    });
            }

            // ----------------------------------------------------
            // 3. BODY
            // ----------------------------------------------------

            const {
                data,
                horario,
            } = req.body;

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

            // ----------------------------------------------------
            // 4. FORMATO DA DATA
            // ----------------------------------------------------

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

            // ----------------------------------------------------
            // 5. FORMATO DO HORÁRIO
            //
            // Não existe mais uma lista fixa de horários.
            //
            // Exemplos válidos:
            // 06:40
            // 09:00
            // 10:40
            // 14:30
            // 20:00
            // ----------------------------------------------------

            if (
                !ehHorarioValido(
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

            // ----------------------------------------------------
            // 6. SERVICE
            // ----------------------------------------------------

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
        } catch (error) {
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

// ============================================================
// VALIDAR HORÁRIO HH:mm
// ============================================================

function ehHorarioValido(
    horario: string
): boolean {
    if (
        !/^\d{2}:\d{2}$/.test(
            horario
        )
    ) {
        return false;
    }

    const partes =
        horario.split(':');

    const horaTexto =
        partes[0];

    const minutoTexto =
        partes[1];

    if (
        horaTexto === undefined ||
        minutoTexto === undefined
    ) {
        return false;
    }

    const hora =
        Number(
            horaTexto
        );

    const minuto =
        Number(
            minutoTexto
        );

    return (
        Number.isInteger(
            hora
        ) &&
        Number.isInteger(
            minuto
        ) &&
        hora >= 0 &&
        hora <= 23 &&
        minuto >= 0 &&
        minuto <= 59
    );
}