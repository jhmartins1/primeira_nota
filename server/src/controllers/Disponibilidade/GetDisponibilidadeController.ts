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
            // =====================================================
            // 1. INSTRUMENTO
            // =====================================================

            const instrumentoIdRaw =
                req.query.instrumentoId;

            const instrumentoIdParam =
                Array.isArray(
                    instrumentoIdRaw
                )
                    ? instrumentoIdRaw[0]
                    : instrumentoIdRaw;

            const instrumentoId =
                Number(
                    instrumentoIdParam
                );

            if (
                !instrumentoId ||
                Number.isNaN(
                    instrumentoId
                ) ||
                instrumentoId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'instrumentoId inválido.',
                    });
            }

            // =====================================================
            // 2. NÍVEL
            // =====================================================

            const nivelIdRaw =
                req.query.nivelId;

            const nivelIdParam =
                Array.isArray(
                    nivelIdRaw
                )
                    ? nivelIdRaw[0]
                    : nivelIdRaw;

            const nivelId =
                Number(
                    nivelIdParam
                );

            if (
                !nivelId ||
                Number.isNaN(
                    nivelId
                ) ||
                nivelId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'nivelId inválido.',
                    });
            }

            // =====================================================
            // 3. PROFESSOR OPCIONAL
            // =====================================================

            const professorIdRaw =
                req.query.professorId;

            const professorIdParam =
                Array.isArray(
                    professorIdRaw
                )
                    ? professorIdRaw[0]
                    : professorIdRaw;

            let professorId:
                number | undefined;

            if (
                professorIdParam !==
                undefined &&
                professorIdParam !==
                null &&
                professorIdParam !==
                ''
            ) {
                const professorIdConvertido =
                    Number(
                        professorIdParam
                    );

                if (
                    Number.isNaN(
                        professorIdConvertido
                    ) ||
                    professorIdConvertido <=
                    0
                ) {
                    return res
                        .status(400)
                        .json({
                            error:
                                'professorId inválido.',
                        });
                }

                professorId =
                    professorIdConvertido;
            }

            // =====================================================
            // 4. BUSCA DISPONIBILIDADE
            // =====================================================

            const horarios =
                await this.service.execute(
                    {
                        instrumentoId,
                        nivelId,
                        professorId,
                    }
                );

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
                        'Erro interno ao buscar horários disponíveis.',
                });
        }
    }
}