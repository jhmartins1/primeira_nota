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

const TIME_ZONE =
    'America/Sao_Paulo';

// Procuramos disponibilidade em até 30 dias.
// Depois retornamos somente as primeiras
// 7 datas que realmente possuem horários.
const LIMITE_BUSCA_DIAS =
    30;

const LIMITE_DATAS =
    7;

export class GetDisponibilidadeService {
    async execute({
        instrumentoId,
        nivelId,
        professorId,
    }: GetDisponibilidadeDTO): Promise<
        HorarioDisponivel[]
    > {
        // ==========================================
        // INSTRUMENTO
        // ==========================================

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

        // ==========================================
        // NÍVEL
        // ==========================================

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

        // ==========================================
        // PROFESSORES QUE ENSINAM
        // O INSTRUMENTO + NÍVEL
        // ==========================================

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

        if (
            professores.length ===
            0
        ) {
            return [];
        }

        const professorIds =
            professores.map(
                (item) =>
                    item.professorId
            );

        // ==========================================
        // PERÍODO
        // ==========================================

        const agora =
            new Date();

        const dataHoje =
            formatarDataSaoPaulo(
                agora
            );

        // Começa amanhã.
        const dataAmanha =
            adicionarDias(
                dataHoje,
                1
            );

        const inicioPeriodo =
            criarDataSaoPaulo(
                dataAmanha,
                '00:00'
            );

        const dataLimite =
            adicionarDias(
                dataAmanha,
                LIMITE_BUSCA_DIAS
            );

        const fimPeriodo =
            criarDataSaoPaulo(
                dataLimite,
                '00:00'
            );

        // ==========================================
        // DISPONIBILIDADES REAIS
        // ==========================================

        const disponibilidades =
            await prisma.disponibilidade.findMany({
                where: {
                    professorId: {
                        in:
                            professorIds,
                    },

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

        // ==========================================
        // AGENDAMENTOS JÁ OCUPADOS
        // ==========================================

        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId: {
                        in:
                            professorIds,
                    },

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
                    professorId:
                        true,

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
                        `${agendamento.professorId}_${agendamento.dataHora.getTime()}`
                )
            );

        // ==========================================
        // AGRUPA PROFESSOR + DATA
        // ==========================================

        const mapaHorarios =
            new Map<
                string,
                {
                    professorId:
                    number;

                    data:
                    string;

                    horarios:
                    Set<string>;
                }
            >();

        for (
            const disponibilidade
            of disponibilidades
        ) {
            const inicio =
                new Date(
                    disponibilidade.horaInicio
                );

            // Segurança extra.
            if (
                inicio <= agora
            ) {
                continue;
            }

            const chaveOcupado =
                `${disponibilidade.professorId}_${inicio.getTime()}`;

            // Se já existe aula neste horário,
            // não mostra para o aluno.
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

        // ==========================================
        // DESCOBRE AS PRIMEIRAS 7 DATAS
        // QUE REALMENTE TÊM DISPONIBILIDADE
        //
        // NÃO IMPORTA SE É:
        // SEGUNDA / SÁBADO / DOMINGO
        // ==========================================

        const datasDisponiveis =
            Array.from(
                new Set(
                    Array.from(
                        mapaHorarios.values()
                    ).map(
                        (grupo) =>
                            grupo.data
                    )
                )
            )
                .sort()
                .slice(
                    0,
                    LIMITE_DATAS
                );

        const datasPermitidas =
            new Set(
                datasDisponiveis
            );

        // ==========================================
        // MONTA RESPOSTA
        // ==========================================

        const resultado:
            HorarioDisponivel[] =
            [];

        for (
            const grupo
            of mapaHorarios.values()
        ) {
            if (
                !datasPermitidas.has(
                    grupo.data
                )
            ) {
                continue;
            }

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
                data:
                    grupo.data,

                professor: {
                    id:
                        professor
                            .professor
                            .id,

                    name:
                        professor
                            .professor
                            .name,

                    image:
                        professor
                            .professor
                            .image,
                },

                instrumento: {
                    id:
                        instrumento.id,

                    name:
                        instrumento.name,
                },

                nivel: {
                    id:
                        nivel.id,

                    name:
                        nivel.name,
                },

                horarios:
                    Array.from(
                        grupo.horarios
                    ).sort(),
            });
        }

        // ==========================================
        // ORDENA CRONOLOGICAMENTE
        // ==========================================

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

// ==========================================
// ADICIONA HORÁRIO
// ==========================================

function adicionarHorario(
    mapa: Map<
        string,
        {
            professorId:
            number;

            data:
            string;

            horarios:
            Set<string>;
        }
    >,

    professorId:
        number,

    data:
        string,

    horario:
        string
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

// ==========================================
// DATA YYYY-MM-DD
// ==========================================

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

// ==========================================
// HORA HH:mm
// ==========================================

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

// ==========================================
// CRIA DATE NO HORÁRIO DE SÃO PAULO
// ==========================================

function criarDataSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

// ==========================================
// SOMA DIAS EM UMA STRING YYYY-MM-DD
// ==========================================

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

    if (
        Number.isNaN(
            ano
        ) ||
        Number.isNaN(
            mes
        ) ||
        Number.isNaN(
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
                dia +
                quantidade,
                12,
                0,
                0
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