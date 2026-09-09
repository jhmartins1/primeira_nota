import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface DeleteDisponibilidadesDiaDTO {
    professorId: number;
    data: string;
}

export class DeleteDisponibilidadesDiaService {
    async execute({
        professorId,
        data,
    }: DeleteDisponibilidadesDiaDTO) {
        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        if (
            !ehDataValida(
                data
            )
        ) {
            throw new AppError(
                'Data inválida. Utilize o formato YYYY-MM-DD.',
                400
            );
        }

        const inicioDia =
            criarInicioDiaSaoPaulo(
                data
            );

        const fimDia =
            criarFimDiaSaoPaulo(
                data
            );

        const agendamento =
            await prisma.agendamento.findFirst(
                {
                    where: {
                        professorId,

                        status:
                            'AGENDADO',

                        dataHora: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                }
            );

        if (
            agendamento
        ) {
            throw new AppError(
                'Existe uma aula agendada neste dia. Cancele a aula antes de remover todos os horários.',
                409
            );
        }

        const quantidadeDisponivel =
            await prisma.disponibilidade.count(
                {
                    where: {
                        professorId,

                        horaInicio: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                }
            );

        if (
            quantidadeDisponivel ===
            0
        ) {
            throw new AppError(
                'Nenhum horário encontrado nesta data.',
                404
            );
        }

        const resultado =
            await prisma.disponibilidade.deleteMany(
                {
                    where: {
                        professorId,

                        horaInicio: {
                            gte:
                                inicioDia,

                            lt:
                                fimDia,
                        },
                    },
                }
            );

        return {
            message:
                'Horários do dia removidos com sucesso.',

            quantidade:
                resultado.count,
        };
    }
}

function ehDataValida(
    data: string
): boolean {
    if (
        typeof data !==
        'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(
            data
        )
    ) {
        return false;
    }

    const partes =
        data.split(
            '-'
        );

    const anoTexto =
        partes[0];

    const mesTexto =
        partes[1];

    const diaTexto =
        partes[2];

    if (
        !anoTexto ||
        !mesTexto ||
        !diaTexto
    ) {
        return false;
    }

    const ano =
        Number(
            anoTexto
        );

    const mes =
        Number(
            mesTexto
        );

    const dia =
        Number(
            diaTexto
        );

    if (
        !Number.isInteger(ano) ||
        !Number.isInteger(mes) ||
        !Number.isInteger(dia)
    ) {
        return false;
    }

    const teste =
        new Date(
            Date.UTC(
                ano,
                mes - 1,
                dia,
                12,
                0,
                0
            )
        );

    return (
        teste.getUTCFullYear() ===
        ano &&
        teste.getUTCMonth() ===
        mes - 1 &&
        teste.getUTCDate() ===
        dia
    );
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