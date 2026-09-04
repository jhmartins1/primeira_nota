import { prisma } from '../../prisma/client';

interface GetDisponibilidadeParams {
    professorId: number;
    dias?: number;
}

interface HorarioDisponivel {
    data: string;
    horaInicio: string;
    horaFim: string;
}

const TIME_ZONE =
    'America/Sao_Paulo';

export class GetDisponibilidadeService {
    async execute({
        professorId,
        dias = 7,
    }: GetDisponibilidadeParams): Promise<
        HorarioDisponivel[]
    > {
        const agora =
            new Date();

        const dataHoje =
            formatarDataSaoPaulo(
                agora
            );

        const dataAmanha =
            adicionarDias(
                dataHoje,
                1
            );

        /*
         * Aqui "dias" significa quantidade
         * de datas com disponibilidade,
         * não dias úteis.
         *
         * Procuramos até 30 dias adiante.
         */
        const dataLimite =
            adicionarDias(
                dataAmanha,
                30
            );

        const inicioPeriodo =
            criarDataSaoPaulo(
                dataAmanha,
                '00:00'
            );

        const fimPeriodo =
            criarDataSaoPaulo(
                dataLimite,
                '00:00'
            );

        const disponibilidades =
            await prisma.disponibilidade.findMany({
                where: {
                    professorId,

                    horaInicio: {
                        gte:
                            inicioPeriodo,

                        lt:
                            fimPeriodo,
                    },
                },

                orderBy: {
                    horaInicio:
                        'asc',
                },
            });

        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId,

                    status:
                        'AGENDADO',

                    dataHora: {
                        gte:
                            inicioPeriodo,

                        lt:
                            fimPeriodo,
                    },
                },

                select: {
                    dataHora:
                        true,
                },
            });

        const horariosOcupados =
            new Set(
                agendamentos.map(
                    (
                        agendamento
                    ) =>
                        agendamento.dataHora.getTime()
                )
            );

        const horarios:
            HorarioDisponivel[] =
            [];

        for (
            const disponibilidade
            of disponibilidades
        ) {
            const inicio =
                new Date(
                    disponibilidade.horaInicio
                );

            const fim =
                new Date(
                    disponibilidade.horaFim
                );

            if (
                inicio <= agora
            ) {
                continue;
            }

            if (
                horariosOcupados.has(
                    inicio.getTime()
                )
            ) {
                continue;
            }

            horarios.push({
                data:
                    formatarDataSaoPaulo(
                        inicio
                    ),

                horaInicio:
                    formatarHoraSaoPaulo(
                        inicio
                    ),

                horaFim:
                    formatarHoraSaoPaulo(
                        fim
                    ),
            });
        }

        /*
         * Descobre as primeiras N datas
         * que realmente possuem horários.
         */
        const datasPermitidas =
            new Set(
                Array.from(
                    new Set(
                        horarios.map(
                            (item) =>
                                item.data
                        )
                    )
                )
                    .sort()
                    .slice(
                        0,
                        dias
                    )
            );

        return horarios
            .filter(
                (item) =>
                    datasPermitidas.has(
                        item.data
                    )
            )
            .sort(
                (a, b) =>
                    `${a.data}T${a.horaInicio}`.localeCompare(
                        `${b.data}T${b.horaInicio}`
                    )
            );
    }
}

function formatarDataSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-CA',
        {
            timeZone:
                TIME_ZONE,

            year:
                'numeric',

            month:
                '2-digit',

            day:
                '2-digit',
        }
    ).format(data);
}

function formatarHoraSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-GB',
        {
            timeZone:
                TIME_ZONE,

            hour:
                '2-digit',

            minute:
                '2-digit',

            hour12:
                false,
        }
    ).format(data);
}

function criarDataSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

function adicionarDias(
    data: string,
    quantidade: number
): string {
    const partes =
        data.split('-');

    if (
        partes.length !==
        3
    ) {
        throw new Error(
            'Data inválida.'
        );
    }

    const ano =
        Number(
            partes[0]
        );

    const mes =
        Number(
            partes[1]
        );

    const dia =
        Number(
            partes[2]
        );

    const dataUTC =
        new Date(
            Date.UTC(
                ano,
                mes - 1,
                dia +
                quantidade,
                12
            )
        );

    const novoAno =
        dataUTC.getUTCFullYear();

    const novoMes =
        String(
            dataUTC.getUTCMonth() +
            1
        ).padStart(
            2,
            '0'
        );

    const novoDia =
        String(
            dataUTC.getUTCDate()
        ).padStart(
            2,
            '0'
        );

    return `${novoAno}-${novoMes}-${novoDia}`;
}