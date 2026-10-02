import { prisma } from '../../prisma/client';

interface CreateAgendamentosLoteDTO {
    usuarioId: number;
    professorId: number;
    instrumentoId: number;
    nivelId: number;
    datasHora: Date[];
}

const DIAS_MAXIMOS_AGENDAMENTO = 30;

export class CreateAgendamentosLoteService {
    async execute({
        usuarioId,
        professorId,
        instrumentoId,
        nivelId,
        datasHora,
    }: CreateAgendamentosLoteDTO) {
        if (
            !Array.isArray(datasHora) ||
            datasHora.length === 0
        ) {
            throw new Error(
                'Selecione pelo menos uma data.'
            );
        }

        // Evita datas duplicadas
        const timestamps = datasHora.map(
            (data) => data.getTime()
        );

        if (
            new Set(timestamps).size !==
            timestamps.length
        ) {
            throw new Error(
                'Existem datas duplicadas no agendamento.'
            );
        }

        const [
            usuario,
            professor,
            instrumento,
            nivel,
            usuarioInstrumento,
            professorInstrumento,
        ] = await Promise.all([
            prisma.usuario.findUnique({
                where: {
                    id: usuarioId,
                },
            }),

            prisma.professor.findUnique({
                where: {
                    id: professorId,
                },
            }),

            prisma.instrumento.findUnique({
                where: {
                    id: instrumentoId,
                },
            }),

            prisma.nivel.findUnique({
                where: {
                    id: nivelId,
                },
            }),

            prisma.usuarioInstrumento.findFirst({
                where: {
                    usuarioId,
                    instrumentoId,
                    nivelId,
                },
            }),

            prisma.professorInstrumento.findFirst({
                where: {
                    professorId,
                    instrumentoId,
                    nivelId,
                },
            }),
        ]);

        if (!usuario) {
            throw new Error(
                'Usuário não encontrado.'
            );
        }

        if (!professor) {
            throw new Error(
                'Professor não encontrado.'
            );
        }

        if (!instrumento) {
            throw new Error(
                'Instrumento não encontrado.'
            );
        }

        if (!nivel) {
            throw new Error(
                'Nível não encontrado.'
            );
        }

        if (!usuarioInstrumento) {
            throw new Error(
                'O usuário não possui esse instrumento e nível cadastrados.'
            );
        }

        if (!professorInstrumento) {
            throw new Error(
                'O professor não leciona esse instrumento nesse nível.'
            );
        }

        const agora = new Date();

        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const amanha = new Date(hoje);

        amanha.setDate(
            amanha.getDate() + 1
        );

        const limite = new Date(hoje);

        limite.setDate(
            limite.getDate() +
            DIAS_MAXIMOS_AGENDAMENTO
        );

        for (const dataHora of datasHora) {
            if (
                !(dataHora instanceof Date) ||
                isNaN(dataHora.getTime())
            ) {
                throw new Error(
                    'Data e horário inválidos.'
                );
            }

            if (dataHora <= agora) {
                throw new Error(
                    'Não é possível agendar uma aula para uma data ou horário passado.'
                );
            }

            const dataComparar =
                new Date(dataHora);

            dataComparar.setHours(
                0,
                0,
                0,
                0
            );

            if (
                dataComparar < amanha ||
                dataComparar > limite
            ) {
                throw new Error(
                    `As aulas devem ser agendadas entre amanhã e os próximos ${DIAS_MAXIMOS_AGENDAMENTO} dias.`
                );
            }
        }

        /*
         * Verifica se todas as datas realmente
         * foram disponibilizadas pelo professor.
         */
        const disponibilidades =
            await prisma.disponibilidade.findMany({
                where: {
                    professorId,

                    horaInicio: {
                        in: datasHora,
                    },
                },

                select: {
                    horaInicio: true,
                },
            });

        const disponibilidadesSet =
            new Set(
                disponibilidades.map(
                    (item) =>
                        item.horaInicio.getTime()
                )
            );

        for (const dataHora of datasHora) {
            if (
                !disponibilidadesSet.has(
                    dataHora.getTime()
                )
            ) {
                throw new Error(
                    'Um ou mais horários selecionados não estão disponíveis para esse professor.'
                );
            }
        }

        /*
         * Verifica conflitos do professor.
         */
        const conflitosProfessor =
            await prisma.agendamento.findMany({
                where: {
                    professorId,

                    dataHora: {
                        in: datasHora,
                    },

                    status: 'AGENDADO',
                },

                select: {
                    dataHora: true,
                },
            });

        if (
            conflitosProfessor.length > 0
        ) {
            throw new Error(
                'Um ou mais horários não estão mais disponíveis para esse professor.'
            );
        }

        /*
         * Verifica conflitos do aluno.
         */
        const conflitosUsuario =
            await prisma.agendamento.findMany({
                where: {
                    usuarioId,

                    dataHora: {
                        in: datasHora,
                    },

                    status: 'AGENDADO',
                },

                select: {
                    dataHora: true,
                },
            });

        if (
            conflitosUsuario.length > 0
        ) {
            throw new Error(
                'Você já possui uma aula em uma ou mais datas selecionadas.'
            );
        }

        /*
         * A transação garante que todos os
         * agendamentos sejam criados juntos.
         *
         * Se um deles falhar, nenhum é criado.
         */
        try {
            return await prisma.$transaction(
                datasHora.map((dataHora) =>
                    prisma.agendamento.create({
                        data: {
                            usuarioId,
                            professorId,
                            instrumentoId,
                            nivelId,
                            dataHora,
                            status: 'AGENDADO',
                        },

                        include: {
                            professor: true,
                            instrumento: true,
                            nivel: true,
                        },
                    })
                )
            );
        } catch (error: any) {
            if (
                error?.code === 'P2002'
            ) {
                throw new Error(
                    'Um ou mais horários não estão mais disponíveis.'
                );
            }

            throw error;
        }
    }
}