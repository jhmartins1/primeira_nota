import { prisma } from '../../prisma/client';

export class GetAgendamentosProfessorService {
    async execute(professorId: number) {
        // ----------------------------------------------------
        // 1. BUSCAR AGENDAMENTOS DO PROFESSOR
        // ----------------------------------------------------

        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId,
                },

                include: {
                    usuario: {
                        select: {
                            id: true,

                            // Nome da conta / Clerk.
                            // Mantido como fallback.
                            name: true,

                            // Dados reais do aluno.
                            nomeAluno: true,
                            faixaEtaria: true,

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

        // ----------------------------------------------------
        // 2. PEGAR USUÁRIOS ÚNICOS
        // ----------------------------------------------------

        const usuarioIds =
            Array.from(
                new Set(
                    agendamentos.map(
                        (agendamento) =>
                            agendamento.usuarioId
                    )
                )
            );

        // ----------------------------------------------------
        // 3. PEGAR INSTRUMENTOS ÚNICOS
        // ----------------------------------------------------

        const instrumentoIds =
            Array.from(
                new Set(
                    agendamentos.map(
                        (agendamento) =>
                            agendamento.instrumentoId
                    )
                )
            );

        // ----------------------------------------------------
        // 4. BUSCAR SE CADA ALUNO POSSUI
        // O INSTRUMENTO DA AULA
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // 5. CRIAR MAPA
        //
        // usuarioId:instrumentoId
        // ->
        // possuiInstrumento
        //
        // Exemplo:
        //
        // 10:3 -> true
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // 6. MONTAR RESPOSTA
        // ----------------------------------------------------

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