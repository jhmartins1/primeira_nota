import { prisma } from '../../prisma/client';

interface GetDisponibilidadeDTO {
    instrumentoId: number;
    nivelId: number;
    professorId?: number;
}

interface HorarioDisponivel {
    data: string;

    professor: {
        id: number;
        name: string;
        image: string | null;
    };

    instrumento: {
        id: number;
        name: string;
    };

    nivel: {
        id: number;
        name: string;
    };

    horarios: string[];
}

const TIME_ZONE = 'America/Sao_Paulo';

const DIAS_MAXIMOS_AGENDAMENTO = 14;

export class GetDisponibilidadeService {
    async execute({
        instrumentoId,
        nivelId,
        professorId,
    }: GetDisponibilidadeDTO): Promise<
        HorarioDisponivel[]
    > {
        // 1. INSTRUMENTO
        const instrumento =
            await prisma.instrumento.findUnique({
                where: {
                    id: instrumentoId,
                },
            });

        if (!instrumento) {
            throw new Error(
                'Instrumento não encontrado.'
            );
        }

        // 2. NÍVEL
        const nivel =
            await prisma.nivel.findUnique({
                where: {
                    id: nivelId,
                },
            });

        if (!nivel) {
            throw new Error(
                'Nível não encontrado.'
            );
        }

        // 3. PROFESSORES
        const professores =
            await prisma.professorInstrumento.findMany({
                where: {
                    instrumentoId,
                    nivelId,

                    ...(professorId
                        ? {
                            professorId,
                        }
                        : {}),
                },

                include: {
                    professor: true,
                },
            });

        if (professores.length === 0) {
            return [];
        }

        const professorIds =
            professores.map(
                (item) =>
                    item.professorId
            );

        // 4. JANELA DE 14 DIAS
        const agora = new Date();

        const hoje =
            formatarDataSaoPaulo(
                agora
            );

        const inicioData =
            adicionarDias(
                hoje,
                1
            );

        const fimData =
            adicionarDias(
                hoje,
                DIAS_MAXIMOS_AGENDAMENTO +
                1
            );

        const inicioPeriodo =
            criarDataSaoPaulo(
                inicioData,
                '00:00'
            );

        const fimPeriodo =
            criarDataSaoPaulo(
                fimData,
                '00:00'
            );

        // 5. DISPONIBILIDADES
        const disponibilidades =
            await prisma.disponibilidade.findMany({
                where: {
                    professorId: {
                        in: professorIds,
                    },

                    horaInicio: {
                        gte: inicioPeriodo,
                        lt: fimPeriodo,
                    },
                },

                orderBy: {
                    horaInicio: 'asc',
                },
            });

        // 6. AGENDAMENTOS OCUPADOS
        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId: {
                        in: professorIds,
                    },

                    status: 'AGENDADO',

                    dataHora: {
                        gte: inicioPeriodo,
                        lt: fimPeriodo,
                    },
                },

                select: {
                    professorId: true,
                    dataHora: true,
                },
            });

        const horariosOcupados =
            new Set(
                agendamentos.map(
                    (
                        agendamento
                    ) =>
                        `${agendamento.professorId}_${agendamento.dataHora.getTime()}`
                )
            );

        // 7. AGRUPAR
        const mapaHorarios =
            new Map<
                string,
                {
                    professorId: number;
                    data: string;
                    horarios: Set<string>;
                }
            >();

        for (
            const disponibilidade of
            disponibilidades
        ) {
            const inicio =
                disponibilidade.horaInicio;

            if (inicio <= agora) {
                continue;
            }

            const chaveOcupado =
                `${disponibilidade.professorId}_${inicio.getTime()}`;

            if (
                horariosOcupados.has(
                    chaveOcupado
                )
            ) {
                continue;
            }

            const data =
                formatarDataSaoPaulo(
                    inicio
                );

            const horario =
                formatarHoraSaoPaulo(
                    inicio
                );

            adicionarHorario(
                mapaHorarios,
                disponibilidade.professorId,
                data,
                horario
            );
        }

        const resultado:
            HorarioDisponivel[] =
            [];

        for (
            const grupo of
            mapaHorarios.values()
        ) {
            const professor =
                professores.find(
                    (item) =>
                        item.professorId ===
                        grupo.professorId
                );

            if (!professor) {
                continue;
            }

            resultado.push({
                data: grupo.data,

                professor: {
                    id:
                        professor.professor.id,

                    name:
                        professor.professor
                            .name,

                    image:
                        professor.professor
                            .image,
                },

                instrumento: {
                    id: instrumento.id,
                    name:
                        instrumento.name,
                },

                nivel: {
                    id: nivel.id,
                    name: nivel.name,
                },

                horarios:
                    Array.from(
                        grupo.horarios
                    ).sort(),
            });
        }

        // 9. ORDENAR
        resultado.sort(
            (a, b) => {
                const horarioA =
                    a.horarios[0] ??
                    '00:00';

                const horarioB =
                    b.horarios[0] ??
                    '00:00';

                const dataA =
                    `${a.data}T${horarioA}`;

                const dataB =
                    `${b.data}T${horarioB}`;

                return dataA.localeCompare(
                    dataB
                );
            }
        );

        return resultado;
    }
}

// ADICIONAR HORÁRIO
function adicionarHorario(
    mapa: Map<
        string,
        {
            professorId: number;
            data: string;
            horarios: Set<string>;
        }
    >,

    professorId: number,
    data: string,
    horario: string
) {
    const chave =
        `${professorId}_${data}`;

    const existente =
        mapa.get(chave);

    if (existente) {
        existente.horarios.add(
            horario
        );

        return;
    }

    mapa.set(
        chave,
        {
            professorId,
            data,

            horarios:
                new Set([
                    horario,
                ]),
        }
    );
}

// FORMATAR DATA
function formatarDataSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-CA',
        {
            timeZone: TIME_ZONE,

            year: 'numeric',

            month: '2-digit',

            day: '2-digit',
        }
    ).format(data);
}

// FORMATAR HORÁRIO
function formatarHoraSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-GB',
        {
            timeZone: TIME_ZONE,

            hour: '2-digit',

            minute: '2-digit',

            hour12: false,
        }
    ).format(data);
}

// CRIAR DATE EM SÃO PAULO
function criarDataSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

// ADICIONAR DIAS
function adicionarDias(
    data: string,
    quantidade: number
): string {
    const partes =
        data.split('-');

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
        throw new Error(
            'Data inválida.'
        );
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
        !Number.isInteger(
            ano
        ) ||
        !Number.isInteger(
            mes
        ) ||
        !Number.isInteger(
            dia
        )
    ) {
        throw new Error(
            'Data inválida.'
        );
    }

    const dataUTC =
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

    dataUTC.setUTCDate(
        dataUTC.getUTCDate() +
        quantidade
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