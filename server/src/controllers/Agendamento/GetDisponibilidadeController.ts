import type { Request, Response } from 'express';

import { GetDisponibilidadeService } from '../../services/Agendamento/GetDisponibilidadeService';

export class GetDisponibilidadeController {
    private service: GetDisponibilidadeService;

    constructor() {
        this.service =
            new GetDisponibilidadeService();
    }

    async handle(
        req: Request,
        res: Response
    ) {
        try {
            const {
                instrumentoId,
                nivelId,
                professorId,
            } = req.query;

            const instrumentoIdNumber =
                Number(instrumentoId);

            const nivelIdNumber =
                Number(nivelId);

            const professorIdNumber =
                professorId !== undefined
                    ? Number(professorId)
                    : undefined;

            if (
                !instrumentoId ||
                Number.isNaN(instrumentoIdNumber) ||
                instrumentoIdNumber <= 0
            ) {
                return res.status(400).json({
                    error:
                        'instrumentoId inválido.',
                });
            }

            if (
                !nivelId ||
                Number.isNaN(nivelIdNumber) ||
                nivelIdNumber <= 0
            ) {
                return res.status(400).json({
                    error:
                        'nivelId inválido.',
                });
            }

            if (
                professorId !== undefined &&
                (
                    Number.isNaN(
                        professorIdNumber
                    ) ||
                    !professorIdNumber ||
                    professorIdNumber <= 0
                )
            ) {
                return res.status(400).json({
                    error:
                        'professorId inválido.',
                });
            }

            const disponibilidade =
                await this.service.execute({
                    instrumentoId:
                        instrumentoIdNumber,

                    nivelId:
                        nivelIdNumber,

                    professorId:
                        professorIdNumber,
                });

            return res.status(200).json(
                disponibilidade
            );
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
                error:
                    'Erro interno do servidor.',
            });
        }
    }
}