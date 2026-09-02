import { prisma } from '../../prisma/client';

interface InstrumentoSelecionado {
    instrumento: string;
    nivel: string;
}

export class SaveUsuarioInstrumentosService {
    async execute(
        usuarioId: number,
        instrumentos: InstrumentoSelecionado[]
    ) {
        if (!instrumentos.length) {
            throw new Error(
                'Pelo menos um instrumento deve ser selecionado'
            );
        }

        const instrumentosUnicos =
            new Map<string, string>();

        for (const item of instrumentos) {
            if (
                !item ||
                typeof item.instrumento !== 'string' ||
                typeof item.nivel !== 'string'
            ) {
                throw new Error(
                    'Instrumento ou nível inválido.'
                );
            }

            instrumentosUnicos.set(
                item.instrumento,
                item.nivel
            );
        }

        const listaFinal =
            Array.from(instrumentosUnicos.entries()).map(
                ([instrumento, nivel]) => ({
                    instrumento,
                    nivel,
                })
            );

        return await prisma.$transaction(async (tx) => {
            const usuario =
                await tx.usuario.findUnique({
                    where: {
                        id: usuarioId,
                    },
                });

            if (!usuario) {
                throw new Error(
                    'Usuário não encontrado.'
                );
            }

            // Busca todos os instrumentos necessários
            const nomesInstrumentos =
                listaFinal.map(
                    (item) => item.instrumento
                );

            const nomesNiveis =
                listaFinal.map(
                    (item) => item.nivel
                );

            const instrumentosBanco =
                await tx.instrumento.findMany({
                    where: {
                        name: {
                            in: nomesInstrumentos,
                        },
                    },
                });

            const niveisBanco =
                await tx.nivel.findMany({
                    where: {
                        name: {
                            in: nomesNiveis,
                        },
                    },
                });

            // Valida instrumentos
            for (const item of listaFinal) {
                const instrumento =
                    instrumentosBanco.find(
                        (itemBanco) =>
                            itemBanco.name ===
                            item.instrumento
                    );

                if (!instrumento) {
                    throw new Error(
                        `Instrumento não encontrado: ${item.instrumento}`
                    );
                }

                const nivel =
                    niveisBanco.find(
                        (nivelBanco) =>
                            nivelBanco.name ===
                            item.nivel
                    );

                if (!nivel) {
                    throw new Error(
                        `Nível não encontrado: ${item.nivel}`
                    );
                }
            }

            // Agora sim substituímos a lista atual
            await tx.usuarioInstrumento.deleteMany({
                where: {
                    usuarioId,
                },
            });

            // Cria a lista final
            for (const item of listaFinal) {
                const instrumento =
                    instrumentosBanco.find(
                        (itemBanco) =>
                            itemBanco.name ===
                            item.instrumento
                    );

                const nivel =
                    niveisBanco.find(
                        (nivelBanco) =>
                            nivelBanco.name ===
                            item.nivel
                    );

                if (!instrumento || !nivel) {
                    throw new Error(
                        'Instrumento ou nível não encontrado.'
                    );
                }

                await tx.usuarioInstrumento.create({
                    data: {
                        usuarioId,
                        instrumentoId:
                            instrumento.id,
                        nivelId: nivel.id,
                    },
                });
            }

            return tx.usuarioInstrumento.findMany({
                where: {
                    usuarioId,
                },
                include: {
                    instrumento: true,
                    nivel: true,
                },
                orderBy: {
                    instrumento: {
                        name: 'asc',
                    },
                },
            });
        });
    }
}