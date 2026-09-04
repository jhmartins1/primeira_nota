import type {
    Request,
    Response,
} from 'express';

import { prisma } from '../../prisma/client';

export class DeleteDisponibilidadesDiaController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            if (
                req.tipoConta !== 'professor' ||
                !req.professorId
            ) {
                return res.status(403).json({
                    error:
                        'Acesso restrito a professores.',
                });
            }

            const dataParam =
                req.params.data;

            const data =
                Array.isArray(dataParam)
                    ? dataParam[0]
                    : dataParam;

            if (
                !data ||
                !/^\d{4}-\d{2}-\d{2}$/.test(
                    data
                )
            ) {
                return res.status(400).json({
                    error:
                        'Data inválida. Utilize o formato YYYY-MM-DD.',
                });
            }

            const inicioDia =
                criarInicioDiaSaoPaulo(
                    data
                );

            const fimDia =
                criarFimDiaSaoPaulo(
                    data
                );

            if (
                Number.isNaN(
                    inicioDia.getTime()
                ) ||
                Number.isNaN(
                    fimDia.getTime()
                )
            ) {
                return res.status(400).json({
                    error:
                        'Data inválida.',
                });
            }

            const agendamento =
                await prisma.agendamento.findFirst({
                    where: {
                        professorId:
                            req.professorId,

                        status:
                            'AGENDADO',

                        dataHora: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                });

            if (agendamento) {
                return res.status(409).json({
                    error:
                        'Existe uma aula agendada neste dia. Cancele a aula antes de remover todos os horários.',
                });
            }

            const quantidadeDisponivel =
                await prisma.disponibilidade.count({
                    where: {
                        professorId:
                            req.professorId,

                        horaInicio: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                });

            if (
                quantidadeDisponivel ===
                0
            ) {
                return res.status(404).json({
                    error:
                        'Nenhum horário encontrado nesta data.',
                });
            }

            const resultado =
                await prisma.disponibilidade.deleteMany({
                    where: {
                        professorId:
                            req.professorId,

                        horaInicio: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                });

            return res.status(200).json({
                message:
                    'Horários do dia removidos com sucesso.',

                quantidade:
                    resultado.count,
            });
        } catch (error) {
            console.error(
                'Erro ao remover horários do dia:',
                error
            );

            return res.status(500).json({
                error:
                    'Erro interno ao remover horários do dia.',
            });
        }
    }
}

function criarInicioDiaSaoPaulo(
    data: string
): Date {
    return new Date(
        `${data}T00:00:00-03:00`
    );
}

function criarFimDiaSaoPaulo(
    data: string
): Date {
    const inicio =
        criarInicioDiaSaoPaulo(
            data
        );

    return new Date(
        inicio.getTime() +
        24 *
        60 *
        60 *
        1000
    );
}