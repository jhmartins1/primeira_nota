import { prisma } from '../../prisma/client';

export class GetAgendamentosProfessorService {
    async execute(professorId: number) {
        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId,
                },

                include: {
                    usuario: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            phone: true,

                            logradouro: true,
                            numero: true,
                            complemento: true,
                            bairro: true,
                            cidade: true,
                            uf: true,
                        },
                    },

                    instrumento: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },

                    nivel: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },

                orderBy: {
                    dataHora: 'asc',
                },
            });

        if (agendamentos.length === 0) {
            return [];
        }

        const usuarioIds = Array.from(
            new Set(
                agendamentos.map(
                    (agendamento) =>
                        agendamento.usuarioId
                )
            )
        );

        const instrumentoIds = Array.from(
            new Set(
                agendamentos.map(
                    (agendamento) =>
                        agendamento.instrumentoId
                )
            )
        );

        const usuariosInstrumentos =
            await prisma.usuarioInstrumento.findMany({
                where: {
                    usuarioId: {
                        in: usuarioIds,
                    },

                    instrumentoId: {
                        in: instrumentoIds,
                    },
                },

                select: {
                    usuarioId: true,
                    instrumentoId: true,
                    possuiInstrumento: true,
                },
            });

        const mapaPossuiInstrumento =
            new Map<string, boolean>();

        for (
            const item of
            usuariosInstrumentos
        ) {
            const chave =
                `${item.usuarioId}:${item.instrumentoId}`;

            mapaPossuiInstrumento.set(
                chave,
                item.possuiInstrumento
            );
        }

        return agendamentos.map(
            (agendamento) => {
                const chave =
                    `${agendamento.usuarioId}:${agendamento.instrumentoId}`;

                const possuiInstrumento =
                    mapaPossuiInstrumento.get(
                        chave
                    ) ?? false;

                return {
                    ...agendamento,

                    possuiInstrumento,
                };
            }
        );
    }
}