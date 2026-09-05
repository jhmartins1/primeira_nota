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
        // =====================================================
        // 1. VERIFICAR INSTRUMENTO
        // =====================================================

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

        // =====================================================
        // 2. VERIFICAR NÍVEL
        // =====================================================

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

        // =====================================================
        // 3. BUSCAR PROFESSORES
        //
        // Somente professores que ensinam:
        // instrumento + nível
        // =====================================================

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

        // =====================================================
        // 4. JANELA DE AGENDAMENTO
        //
        // Se hoje for 05/09:
        //
        // começa: 06/09
        // último permitido: 19/09
        // fim exclusivo: 20/09
        //
        // Ou seja:
        // amanhã até hoje + 14 dias
        // =====================================================

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

        /*
         * Como usamos:
         *
         * lt: fimPeriodo
         *
         * precisamos usar hoje +15
         * como limite exclusivo.
         */
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
        // 5. BUSCAR DISPONIBILIDADES REAIS
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
        // 6. BUSCAR AGENDAMENTOS OCUPADOS
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
        // 7. CRIAR SET DE HORÁRIOS OCUPADOS
        const horariosOcupados =
            new Set(
                agendamentos.map(
                    (
                        agendamento
                    ) =>
                        `${agendamento.professorId}_${agendamento.dataHora.getTime()}`
                )
            );

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

            // Segurança extra

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
        // 10. ORDENAR
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

// ADICIONAR HORÁRIO AO MAPA
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