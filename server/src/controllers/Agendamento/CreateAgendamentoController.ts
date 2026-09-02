import type { Request, Response } from 'express';
import { CreateAgendamentoService } from '../../services/Agendamento/CreateAgendamentoService';

export class CreateAgendamentoController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.usuarioId) {
                return res.status(401).json({
                    error: 'Usuário não autenticado.',
                });
            }

            const usuarioId = req.usuarioId;

            const {
                professorId,
                instrumentoId,
                nivelId,
                dataHora,
            } = req.body;

            if (
                !professorId ||
                !instrumentoId ||
                !nivelId ||
                !dataHora
            ) {
                return res.status(400).json({
                    error:
                        'professorId, instrumentoId, nivelId e dataHora são obrigatórios.',
                });
            }

            const data = new Date(dataHora);

            if (isNaN(data.getTime())) {
                return res.status(400).json({
                    error: 'Data e horário inválidos.',
                });
            }

            const createAgendamentoService =
                new CreateAgendamentoService();

            const agendamento =
                await createAgendamentoService.execute({
                    usuarioId,
                    professorId: Number(professorId),
                    instrumentoId: Number(instrumentoId),
                    nivelId: Number(nivelId),
                    dataHora: data,
                });

            return res.status(201).json(agendamento);
        } catch (error) {
            console.error(
                'Erro ao criar agendamento:',
                error
            );

            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message,
                });
            }

            return res.status(500).json({
                error: 'Erro interno do servidor.',
            });
        }
    }
}