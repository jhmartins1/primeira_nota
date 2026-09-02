
import type { Request, Response } from 'express';
import { GetAgendamentosService } from '../../services/Agendamento/GetAgendamentosService';

export class GetAgendamentosController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.usuarioId) {
                return res.status(401).json({
                    error: 'Usuário não autenticado.',
                });
            }

            const usuarioId = req.usuarioId;

            const service =
                new GetAgendamentosService();

            const agendamentos =
                await service.execute({
                    usuarioId,
                });

            return res.status(200).json(
                agendamentos
            );
        } catch (error) {
            console.error(
                'Erro ao buscar agendamentos:',
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

