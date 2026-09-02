import type { Request, Response } from 'express';
import { GetDisponibilidadeService } from '../../services/Agendamento/GetDisponibilidadeService';

export class GetDisponibilidadeController {
    async handle(req: Request, res: Response) {
        try {
            const { instrumentoId, nivelId, professorId } =
                req.query;

            if (!instrumentoId || !nivelId) {
                return res.status(400).json({
                    error:
                        'instrumentoId e nivelId são obrigatórios.',
                });
            }

            const service =
                new GetDisponibilidadeService();

            const disponibilidade =
                await service.execute({
                    instrumentoId: Number(instrumentoId),
                    nivelId: Number(nivelId),

                    professorId: professorId
                        ? Number(professorId)
                        : undefined,
                });

            return res.status(200).json(disponibilidade);
        } catch (error) {
            console.error(
                'Erro ao buscar disponibilidade:',
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