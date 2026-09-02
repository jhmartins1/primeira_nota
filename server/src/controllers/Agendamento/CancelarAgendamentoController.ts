import type { Request, Response } from 'express';
import { CancelarAgendamentoService } from '../../services/Agendamento/CancelarAgendamentoService';

export class CancelarAgendamentoController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.usuarioId) {
                return res.status(401).json({
                    error: 'Usuário não autenticado.',
                });
            }

            const agendamentoId = Number(
                req.params.id
            );

            if (
                !Number.isInteger(agendamentoId) ||
                agendamentoId <= 0
            ) {
                return res.status(400).json({
                    error:
                        'ID do agendamento inválido.',
                });
            }

            const service =
                new CancelarAgendamentoService();

            const agendamento =
                await service.execute({
                    usuarioId: req.usuarioId,
                    agendamentoId,
                });

            return res.status(200).json({
                message:
                    'Agendamento cancelado com sucesso.',
                agendamento,
            });
        } catch (error) {
            console.error(
                'Erro ao cancelar agendamento:',
                error
            );

            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message,
                });
            }

            return res.status(500).json({
                error:
                    'Erro interno do servidor.',
            });
        }
    }
}

