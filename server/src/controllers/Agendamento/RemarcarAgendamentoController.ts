import type {
    Request,
    Response,
} from 'express';

import { RemarcarAgendamentoService } from '../../services/Agendamento/RemarcarAgendamentoService';

export class RemarcarAgendamentoController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            // ------------------------------------------------
            // AUTENTICAÇÃO
            // ------------------------------------------------

            if (!req.usuarioId) {
                return res.status(401).json({
                    error:
                        'Usuário não autenticado.',
                });
            }

            const usuarioId =
                req.usuarioId;

            // ------------------------------------------------
            // ID DO AGENDAMENTO
            // ------------------------------------------------

            const agendamentoId =
                Number(req.params.id);

            if (
                !Number.isInteger(
                    agendamentoId
                ) ||
                agendamentoId <= 0
            ) {
                return res.status(400).json({
                    error:
                        'ID do agendamento inválido.',
                });
            }

            // ------------------------------------------------
            // BODY
            // ------------------------------------------------

            const {
                data,
                horario,
            } = req.body;

            if (
                !data ||
                !horario
            ) {
                return res.status(400).json({
                    error:
                        'data e horario são obrigatórios.',
                });
            }

            // ------------------------------------------------
            // VALIDAR FORMATO DA DATA
            // YYYY-MM-DD
            // ------------------------------------------------

            const regexData =
                /^\d{4}-\d{2}-\d{2}$/;

            if (
                !regexData.test(data)
            ) {
                return res.status(400).json({
                    error:
                        'Formato de data inválido. Use YYYY-MM-DD.',
                });
            }

            // ------------------------------------------------
            // VALIDAR FORMATO DO HORÁRIO
            // HH:mm
            // ------------------------------------------------

            const regexHorario =
                /^\d{2}:\d{2}$/;

            if (
                !regexHorario.test(
                    horario
                )
            ) {
                return res.status(400).json({
                    error:
                        'Formato de horário inválido. Use HH:mm.',
                });
            }

            // ------------------------------------------------
            // CRIAR DATA/HORA EM SÃO PAULO
            //
            // Ex:
            // 2026-09-16T14:00:00-03:00
            //
            // Isso vira UTC internamente:
            // 2026-09-16T17:00:00.000Z
            // ------------------------------------------------

            const dataHora =
                new Date(
                    `${data}T${horario}:00-03:00`
                );

            if (
                Number.isNaN(
                    dataHora.getTime()
                )
            ) {
                return res.status(400).json({
                    error:
                        'Data ou horário inválidos.',
                });
            }

            // ------------------------------------------------
            // SERVICE
            // ------------------------------------------------

            const service =
                new RemarcarAgendamentoService();

            const agendamento =
                await service.execute({
                    usuarioId,
                    agendamentoId,
                    dataHora,
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
                'Erro ao remarcar agendamento:',
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