import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

/**
 * =====================================================
 * MOCKS
 * =====================================================
 */

const instrumentoFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

const nivelFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

const professorInstrumentoFindManyMock =
    mock(
        (_args: any) =>
            Promise.resolve<any[]>(
                []
            )
    );

const disponibilidadeFindManyMock =
    mock(
        (_args: any) =>
            Promise.resolve<any[]>(
                []
            )
    );

const agendamentoFindManyMock =
    mock(
        (_args: any) =>
            Promise.resolve<any[]>(
                []
            )
    );

/**
 * =====================================================
 * MOCK DO PRISMA
 * =====================================================
 */

mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            instrumento: {
                findUnique:
                    instrumentoFindUniqueMock,
            },

            nivel: {
                findUnique:
                    nivelFindUniqueMock,
            },

            professorInstrumento: {
                findMany:
                    professorInstrumentoFindManyMock,
            },

            disponibilidade: {
                findMany:
                    disponibilidadeFindManyMock,
            },

            agendamento: {
                findMany:
                    agendamentoFindManyMock,
            },
        },
    })
);

/**
 * Importar somente após
 * mockar o Prisma.
 */
const {
    GetDisponibilidadeService,
} = await import(
    '../../../services/Agendamento/GetDisponibilidadeService'
);

const TIME_ZONE =
    'America/Sao_Paulo';

/**
 * =====================================================
 * HELPERS
 * =====================================================
 */

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
    ).format(
        data
    );
}

function adicionarDias(
    data: string,
    quantidade: number
): string {
    const [
        anoTexto,
        mesTexto,
        diaTexto,
    ] = data.split('-');

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

function criarDataFutura(
    dias: number
): string {
    const hoje =
        formatarDataSaoPaulo(
            new Date()
        );

    return adicionarDias(
        hoje,
        dias
    );
}

function criarDataHoraSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

function criarProfessorInstrumento(
    professorId: number,
    nome: string
) {
    return {
        id:
            professorId,

        professorId,

        instrumentoId:
            1,

        nivelId:
            1,

        professor: {
            id:
                professorId,

            name:
                nome,

            image:
                null,
        },
    };
}

/**
 * =====================================================
 * TESTES
 * =====================================================
 */

describe(
    'GetDisponibilidadeService',
    () => {
        beforeEach(() => {
            instrumentoFindUniqueMock.mockReset();

            nivelFindUniqueMock.mockReset();

            professorInstrumentoFindManyMock.mockReset();

            disponibilidadeFindManyMock.mockReset();

            agendamentoFindManyMock.mockReset();

            /**
             * Instrumento válido.
             */
            instrumentoFindUniqueMock.mockResolvedValue(
                {
                    id:
                        1,

                    name:
                        'Violão',
                }
            );

            /**
             * Nível válido.
             */
            nivelFindUniqueMock.mockResolvedValue(
                {
                    id:
                        1,

                    name:
                        'Iniciante',
                }
            );

            /**
             * Professor padrão.
             */
            professorInstrumentoFindManyMock.mockResolvedValue(
                [
                    criarProfessorInstrumento(
                        2,
                        'Professor Teste'
                    ),
                ]
            );

            /**
             * Por padrão:
             * nenhuma disponibilidade.
             */
            disponibilidadeFindManyMock.mockResolvedValue(
                []
            );

            /**
             * Por padrão:
             * nenhum horário ocupado.
             */
            agendamentoFindManyMock.mockResolvedValue(
                []
            );
        });

        /**
         * =====================================================
         * 1
         * =====================================================
         */
        test(
            'deve rejeitar quando o instrumento não existir',
            async () => {
                instrumentoFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new GetDisponibilidadeService();

                await expect(
                    service.execute({
                        instrumentoId:
                            999,

                        nivelId:
                            1,
                    })
                ).rejects.toThrow(
                    'Instrumento não encontrado.'
                );

                expect(
                    nivelFindUniqueMock
                ).not.toHaveBeenCalled();

                expect(
                    professorInstrumentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 2
         * =====================================================
         */
        test(
            'deve rejeitar quando o nível não existir',
            async () => {
                nivelFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new GetDisponibilidadeService();

                await expect(
                    service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            999,
                    })
                ).rejects.toThrow(
                    'Nível não encontrado.'
                );

                expect(
                    professorInstrumentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 3
         * =====================================================
         */
        test(
            'deve retornar array vazio quando nenhum professor ensinar o instrumento e nível',
            async () => {
                professorInstrumentoFindManyMock.mockResolvedValue(
                    []
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual(
                    []
                );

                expect(
                    disponibilidadeFindManyMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 4
         * =====================================================
         */
        test(
            'deve buscar professores pelo instrumento e nível',
            async () => {
                const service =
                    new GetDisponibilidadeService();

                await service.execute({
                    instrumentoId:
                        1,

                    nivelId:
                        1,
                });

                expect(
                    professorInstrumentoFindManyMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            instrumentoId:
                                1,

                            nivelId:
                                1,
                        },

                        include: {
                            professor:
                                true,
                        },
                    }
                );
            }
        );

        /**
         * =====================================================
         * 5
         * =====================================================
         */
        test(
            'deve filtrar por professorId quando informado',
            async () => {
                const service =
                    new GetDisponibilidadeService();

                await service.execute({
                    instrumentoId:
                        1,

                    nivelId:
                        1,

                    professorId:
                        2,
                });

                expect(
                    professorInstrumentoFindManyMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            instrumentoId:
                                1,

                            nivelId:
                                1,

                            professorId:
                                2,
                        },

                        include: {
                            professor:
                                true,
                        },
                    }
                );
            }
        );

        /**
         * =====================================================
         * 6
         * =====================================================
         */
        test(
            'deve buscar disponibilidades apenas dos professores encontrados',
            async () => {
                professorInstrumentoFindManyMock.mockResolvedValue(
                    [
                        criarProfessorInstrumento(
                            2,
                            'Professor A'
                        ),

                        criarProfessorInstrumento(
                            3,
                            'Professor B'
                        ),
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                await service.execute({
                    instrumentoId:
                        1,

                    nivelId:
                        1,
                });

                expect(
                    disponibilidadeFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );

                const chamada =
                    disponibilidadeFindManyMock.mock.calls[0];

                expect(
                    chamada
                ).toBeDefined();

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.professorId
                ).toEqual({
                    in: [
                        2,
                        3,
                    ],
                });

                expect(
                    argumentos.orderBy
                ).toEqual({
                    horaInicio:
                        'asc',
                });
            }
        );

        /**
         * =====================================================
         * 7
         * =====================================================
         */
        test(
            'deve usar uma janela de amanhã até os próximos 14 dias',
            async () => {
                const service =
                    new GetDisponibilidadeService();

                await service.execute({
                    instrumentoId:
                        1,

                    nivelId:
                        1,
                });

                const hoje =
                    formatarDataSaoPaulo(
                        new Date()
                    );

                const inicioEsperado =
                    criarDataHoraSaoPaulo(
                        adicionarDias(
                            hoje,
                            1
                        ),

                        '00:00'
                    );

                /**
                 * O service usa limite
                 * exclusivo hoje + 15.
                 */
                const fimEsperado =
                    criarDataHoraSaoPaulo(
                        adicionarDias(
                            hoje,
                            15
                        ),

                        '00:00'
                    );

                const chamada =
                    disponibilidadeFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.horaInicio.gte
                ).toEqual(
                    inicioEsperado
                );

                expect(
                    argumentos.where.horaInicio.lt
                ).toEqual(
                    fimEsperado
                );
            }
        );

        /**
         * =====================================================
         * 8
         * =====================================================
         */
        test(
            'deve buscar somente agendamentos com status AGENDADO',
            async () => {
                const service =
                    new GetDisponibilidadeService();

                await service.execute({
                    instrumentoId:
                        1,

                    nivelId:
                        1,
                });

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.professorId
                ).toEqual({
                    in: [
                        2,
                    ],
                });

                expect(
                    argumentos.where.status
                ).toBe(
                    'AGENDADO'
                );

                expect(
                    argumentos.select
                ).toEqual({
                    professorId:
                        true,

                    dataHora:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 9
         * =====================================================
         */
        test(
            'deve retornar horário disponível quando não houver conflito',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                100,

                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),

                            horaFim:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '10:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual([
                    {
                        data,

                        professor: {
                            id:
                                2,

                            name:
                                'Professor Teste',

                            image:
                                null,
                        },

                        instrumento: {
                            id:
                                1,

                            name:
                                'Violão',
                        },

                        nivel: {
                            id:
                                1,

                            name:
                                'Iniciante',
                        },

                        horarios: [
                            '09:00',
                        ],
                    },
                ]);
            }
        );

        /**
         * =====================================================
         * 10
         * =====================================================
         */
        test(
            'deve remover horário já ocupado por um agendamento',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const horario =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                100,

                            professorId:
                                2,

                            horaInicio:
                                horario,

                            horaFim:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '10:00'
                                ),
                        },
                    ]
                );

                agendamentoFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            dataHora:
                                horario,
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual(
                    []
                );
            }
        );

        /**
         * =====================================================
         * 11
         * =====================================================
         */
        test(
            'deve considerar conflito apenas quando professor e horário forem iguais',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const horario =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                100,

                            professorId:
                                2,

                            horaInicio:
                                horario,

                            horaFim:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '10:00'
                                ),
                        },
                    ]
                );

                /**
                 * Outro professor possui
                 * aula no mesmo horário.
                 *
                 * Não deve bloquear
                 * o professor 2.
                 */
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                3,

                            dataHora:
                                horario,
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    1
                );

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 12
         * =====================================================
         */
        test(
            'deve agrupar vários horários do mesmo professor no mesmo dia',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                100,

                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),
                        },

                        {
                            id:
                                101,

                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '10:00'
                                ),
                        },

                        {
                            id:
                                102,

                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '11:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    1
                );

                expect(
                    resultado[0]?.data
                ).toBe(
                    data
                );

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                    '10:00',
                    '11:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 13
         * =====================================================
         */
        test(
            'deve remover horários duplicados do mesmo professor e dia',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const horario =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                100,

                            professorId:
                                2,

                            horaInicio:
                                horario,
                        },

                        {
                            id:
                                101,

                            professorId:
                                2,

                            horaInicio:
                                horario,
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    1
                );

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 14
         * =====================================================
         */
        test(
            'deve ordenar os horários do mesmo dia',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '16:00'
                                ),
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '14:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                    '14:00',
                    '16:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 15
         * =====================================================
         */
        test(
            'deve manter professores diferentes separados',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                professorInstrumentoFindManyMock.mockResolvedValue(
                    [
                        criarProfessorInstrumento(
                            2,
                            'Professor A'
                        ),

                        criarProfessorInstrumento(
                            3,
                            'Professor B'
                        ),
                    ]
                );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),
                        },

                        {
                            professorId:
                                3,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    2
                );

                const professor2 =
                    resultado.find(
                        (item) =>
                            item.professor.id ===
                            2
                    );

                const professor3 =
                    resultado.find(
                        (item) =>
                            item.professor.id ===
                            3
                    );

                expect(
                    professor2
                ).toBeDefined();

                expect(
                    professor3
                ).toBeDefined();

                expect(
                    professor2?.horarios
                ).toEqual([
                    '09:00',
                ]);

                expect(
                    professor3?.horarios
                ).toEqual([
                    '09:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 16
         * =====================================================
         */
        test(
            'deve manter dias diferentes do mesmo professor separados',
            async () => {
                const data1 =
                    criarDataFutura(
                        2
                    );

                const data2 =
                    criarDataFutura(
                        3
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data1,
                                    '09:00'
                                ),
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data2,
                                    '10:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    2
                );

                expect(
                    resultado[0]?.data
                ).toBe(
                    data1
                );

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                ]);

                expect(
                    resultado[1]?.data
                ).toBe(
                    data2
                );

                expect(
                    resultado[1]?.horarios
                ).toEqual([
                    '10:00',
                ]);
            }
        );

        /**
         * =====================================================
         * 17
         * =====================================================
         */
        test(
            'deve ordenar os resultados por data e horário',
            async () => {
                const data1 =
                    criarDataFutura(
                        2
                    );

                const data2 =
                    criarDataFutura(
                        3
                    );

                /**
                 * Ordem propositalmente
                 * invertida.
                 */
                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data2,
                                    '09:00'
                                ),
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data1,
                                    '14:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    2
                );

                expect(
                    resultado[0]?.data
                ).toBe(
                    data1
                );

                expect(
                    resultado[1]?.data
                ).toBe(
                    data2
                );
            }
        );

        /**
         * =====================================================
         * 18
         * =====================================================
         */
        test(
            'deve ignorar disponibilidade que já passou',
            async () => {
                const dataPassada =
                    new Date();

                dataPassada.setDate(
                    dataPassada.getDate() -
                    1
                );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                dataPassada,
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual(
                    []
                );
            }
        );

        /**
         * =====================================================
         * 19
         * =====================================================
         */
        test(
            'deve incluir corretamente os dados do professor, instrumento e nível',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                professorInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            id:
                                5,

                            professorId:
                                2,

                            instrumentoId:
                                1,

                            nivelId:
                                1,

                            professor: {
                                id:
                                    2,

                                name:
                                    'João Professor',

                                image:
                                    'https://imagem.com/professor.jpg',
                            },
                        },
                    ]
                );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                criarDataHoraSaoPaulo(
                                    data,
                                    '09:00'
                                ),
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado[0]
                ).toEqual({
                    data,

                    professor: {
                        id:
                            2,

                        name:
                            'João Professor',

                        image:
                            'https://imagem.com/professor.jpg',
                    },

                    instrumento: {
                        id:
                            1,

                        name:
                            'Violão',
                    },

                    nivel: {
                        id:
                            1,

                        name:
                            'Iniciante',
                    },

                    horarios: [
                        '09:00',
                    ],
                });
            }
        );

        /**
         * =====================================================
         * 20
         * =====================================================
         */
        test(
            'deve retornar somente horários livres quando houver horários livres e ocupados no mesmo dia',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const horario09 =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                const horario10 =
                    criarDataHoraSaoPaulo(
                        data,
                        '10:00'
                    );

                const horario11 =
                    criarDataHoraSaoPaulo(
                        data,
                        '11:00'
                    );

                disponibilidadeFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            horaInicio:
                                horario09,
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                horario10,
                        },

                        {
                            professorId:
                                2,

                            horaInicio:
                                horario11,
                        },
                    ]
                );

                /**
                 * 10:00 já está ocupado.
                 */
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        {
                            professorId:
                                2,

                            dataHora:
                                horario10,
                        },
                    ]
                );

                const service =
                    new GetDisponibilidadeService();

                const resultado =
                    await service.execute({
                        instrumentoId:
                            1,

                        nivelId:
                            1,
                    });

                expect(
                    resultado
                ).toHaveLength(
                    1
                );

                expect(
                    resultado[0]?.horarios
                ).toEqual([
                    '09:00',
                    '11:00',
                ]);
            }
        );
    }
);