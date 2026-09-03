import { prisma } from '../../prisma/client';

interface InstrumentoSelecionado {
    instrumento: string;
    nivel: string;
}

export class SaveProfessorInstrumentosService {
    async execute(
        professorId: number,
        instrumentos: InstrumentoSelecionado[]
    ) {
        if (!instrumentos.length) {
            throw new Error(
                'Pelo menos um instrumento deve ser selecionado'
            );
        }

        /*
         * Remove duplicações de:
         *
         * instrumento + nível
         *
         * Exemplo:
         *
         * Teclado + Iniciante
         * Teclado + Iniciante
         *
         * vira apenas:
         *
         * Teclado + Iniciante
         *
         * Porém:
         *
         * Teclado + Iniciante
         * Teclado + Intermediário
         *
         * continuam existindo.
         */
        const combinacoesUnicas =
            new Map<
                string,
                InstrumentoSelecionado
            >();

        for (const item of instrumentos) {
            if (
                !item ||
                typeof item.instrumento !==
                'string' ||
                typeof item.nivel !==
                'string'
            ) {
                throw new Error(
                    'Instrumento ou nível inválido.'
                );
            }

            const instrumento =
                item.instrumento.trim();

            const nivel =
                item.nivel.trim();

            if (
                !instrumento ||
                !nivel
            ) {
                throw new Error(
                    'Instrumento ou nível inválido.'
                );
            }

            const chave =
                `${instrumento}::${nivel}`;

            combinacoesUnicas.set(
                chave,
                {
                    instrumento,
                    nivel,
                }
            );
        }

        const listaFinal =
            Array.from(
                combinacoesUnicas.values()
            );

        if (!listaFinal.length) {
            throw new Error(
                'Pelo menos um instrumento deve ser selecionado'
            );
        }

        return await prisma.$transaction(
            async (tx) => {
                const professor =
                    await tx.professor.findUnique(
                        {
                            where: {
                                id: professorId,
                            },
                        }
                    );

                if (!professor) {
                    throw new Error(
                        'Professor não encontrado.'
                    );
                }

                const nomesInstrumentos =
                    Array.from(
                        new Set(
                            listaFinal.map(
                                (item) =>
                                    item.instrumento
                            )
                        )
                    );

                const nomesNiveis =
                    Array.from(
                        new Set(
                            listaFinal.map(
                                (item) =>
                                    item.nivel
                            )
                        )
                    );

                const instrumentosBanco =
                    await tx.instrumento.findMany(
                        {
                            where: {
                                name: {
                                    in: nomesInstrumentos,
                                },
                            },
                        }
                    );

                const niveisBanco =
                    await tx.nivel.findMany({
                        where: {
                            name: {
                                in: nomesNiveis,
                            },
                        },
                    });

                /*
                 * Validamos todos os instrumentos
                 * antes de alterar o banco.
                 */
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

                /*
                 * Apaga as configurações antigas
                 * do professor.
                 *
                 * Depois recriamos tudo com a seleção
                 * atualizada.
                 */
                await tx.professorInstrumento.deleteMany(
                    {
                        where: {
                            professorId,
                        },
                    }
                );

                /*
                 * Cria uma linha para cada
                 * instrumento + nível.
                 *
                 * Exemplo:
                 *
                 * Teclado + Iniciante
                 * Teclado + Intermediário
                 * Violão + Avançado
                 */
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

                    if (
                        !instrumento ||
                        !nivel
                    ) {
                        throw new Error(
                            'Instrumento ou nível não encontrado.'
                        );
                    }

                    await tx.professorInstrumento.create(
                        {
                            data: {
                                professorId,
                                instrumentoId:
                                    instrumento.id,
                                nivelId:
                                    nivel.id,
                            },
                        }
                    );
                }

                return tx.professorInstrumento.findMany(
                    {
                        where: {
                            professorId,
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
                    }
                );
            }
        );
    }
}