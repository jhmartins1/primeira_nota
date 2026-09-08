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

const agendamentoFindManyMock =
    mock(
        (_args: any) =>
            Promise.resolve<any[]>(
                []
            )
    );

const usuarioInstrumentoFindManyMock =
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
            agendamento: {
                findMany:
                    agendamentoFindManyMock,
            },

            usuarioInstrumento: {
                findMany:
                    usuarioInstrumentoFindManyMock,
            },
        },
    })
);

/**
 * Importar somente depois
 * de mockar o Prisma.
 */
const {
    GetAgendamentosProfessorService,
} = await import(
    '../../../services/Agendamento/GetAgendamentosProfessorService'
);

/**
 * =====================================================
 * HELPERS
 * =====================================================
 */

function criarDataFutura(
    dias = 2,
    hora = 10
): Date {
    const data =
        new Date();

    data.setDate(
        data.getDate() +
        dias
    );

    data.setHours(
        hora,
        0,
        0,
        0
    );

    return data;
}

function criarAgendamento({
    id = 1,
    usuarioId = 10,
    professorId = 2,
    instrumentoId = 1,
    nivelId = 1,
    dataHora = criarDataFutura(),
}: {
    id?: number;
    usuarioId?: number;
    professorId?: number;
    instrumentoId?: number;
    nivelId?: number;
    dataHora?: Date;
} = {}) {
    return {
        id,

        usuarioId,

        professorId,

        instrumentoId,

        nivelId,

        dataHora,

        status:
            'AGENDADO' as const,

        createdAt:
            new Date(),

        usuario: {
            id:
                usuarioId,

            name:
                `Aluno ${usuarioId}`,

            image:
                null,

            phone:
                '61999999999',

            logradouro:
                'Rua Teste',

            numero:
                '100',

            complemento:
                null,

            bairro:
                'Centro',

            cidade:
                'Brasília',

            uf:
                'DF',
        },

        instrumento: {
            id:
                instrumentoId,

            name:
                instrumentoId === 1
                    ? 'Violão'
                    : 'Piano',
        },

        nivel: {
            id:
                nivelId,

            name:
                'Iniciante',
        },
    };
}

/**
 * =====================================================
 * TESTES
 * =====================================================
 */

describe(
    'GetAgendamentosProfessorService',
    () => {
        beforeEach(() => {
            agendamentoFindManyMock.mockReset();

            usuarioInstrumentoFindManyMock.mockReset();

            agendamentoFindManyMock.mockResolvedValue(
                []
            );

            usuarioInstrumentoFindManyMock.mockResolvedValue(
                []
            );
        });

        /**
         * =====================================================
         * 1
         * =====================================================
         */
        test(
            'deve buscar os agendamentos pelo professorId informado',
            async () => {
                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                expect(
                    agendamentoFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where
                ).toEqual({
                    professorId:
                        2,
                });
            }
        );

        /**
         * =====================================================
         * 2
         * =====================================================
         */
        test(
            'deve selecionar os dados necessários do aluno',
            async () => {
                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos
                        .include
                        .usuario
                        .select
                ).toEqual({
                    id:
                        true,

                    name:
                        true,

                    image:
                        true,

                    phone:
                        true,

                    logradouro:
                        true,

                    numero:
                        true,

                    complemento:
                        true,

                    bairro:
                        true,

                    cidade:
                        true,

                    uf:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 3
         * =====================================================
         */
        test(
            'deve selecionar id e nome do instrumento',
            async () => {
                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos
                        .include
                        .instrumento
                        .select
                ).toEqual({
                    id:
                        true,

                    name:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 4
         * =====================================================
         */
        test(
            'deve selecionar id e nome do nível',
            async () => {
                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos
                        .include
                        .nivel
                        .select
                ).toEqual({
                    id:
                        true,

                    name:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 5
         * =====================================================
         */
        test(
            'deve ordenar os agendamentos por dataHora crescente',
            async () => {
                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.orderBy
                ).toEqual({
                    dataHora:
                        'asc',
                });
            }
        );

        /**
         * =====================================================
         * 6
         * =====================================================
         */
        test(
            'deve retornar array vazio quando o professor não possuir agendamentos',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    []
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado
                ).toEqual(
                    []
                );

                expect(
                    usuarioInstrumentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 7
         * =====================================================
         */
        test(
            'deve buscar os instrumentos dos usuários envolvidos nos agendamentos',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                11,

                            instrumentoId:
                                2,
                        }),
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                expect(
                    usuarioInstrumentoFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );

                const chamada =
                    usuarioInstrumentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.usuarioId
                ).toEqual({
                    in: [
                        10,
                        11,
                    ],
                });

                expect(
                    argumentos.where.instrumentoId
                ).toEqual({
                    in: [
                        1,
                        2,
                    ],
                });
            }
        );

        /**
         * =====================================================
         * 8
         * =====================================================
         */
        test(
            'deve remover usuarioIds e instrumentoIds duplicados antes da consulta',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                3,

                            usuarioId:
                                11,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    usuarioInstrumentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.usuarioId
                ).toEqual({
                    in: [
                        10,
                        11,
                    ],
                });

                expect(
                    argumentos.where.instrumentoId
                ).toEqual({
                    in: [
                        1,
                    ],
                });
            }
        );

        /**
         * =====================================================
         * 9
         * =====================================================
         */
        test(
            'deve selecionar somente usuarioId, instrumentoId e possuiInstrumento',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento(),
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                const chamada =
                    usuarioInstrumentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.select
                ).toEqual({
                    usuarioId:
                        true,

                    instrumentoId:
                        true,

                    possuiInstrumento:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 10
         * =====================================================
         */
        test(
            'deve retornar possuiInstrumento true quando o aluno possuir o instrumento da aula',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado
                ).toHaveLength(
                    1
                );

                expect(
                    resultado[0]
                        ?.possuiInstrumento
                ).toBe(
                    true
                );
            }
        );

        /**
         * =====================================================
         * 11
         * =====================================================
         */
        test(
            'deve retornar possuiInstrumento false quando o aluno informar que não possui o instrumento',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                false,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado[0]
                        ?.possuiInstrumento
                ).toBe(
                    false
                );
            }
        );

        /**
         * =====================================================
         * 12
         * =====================================================
         */
        test(
            'deve usar false como padrão quando não existir relação UsuarioInstrumento',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    []
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado[0]
                        ?.possuiInstrumento
                ).toBe(
                    false
                );
            }
        );

        /**
         * =====================================================
         * 13
         * =====================================================
         */
        test(
            'deve associar possuiInstrumento pelo par usuarioId e instrumentoId',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                10,

                            instrumentoId:
                                2,
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },

                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                2,

                            possuiInstrumento:
                                false,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                const violao =
                    resultado.find(
                        (item) =>
                            item.instrumentoId ===
                            1
                    );

                const piano =
                    resultado.find(
                        (item) =>
                            item.instrumentoId ===
                            2
                    );

                expect(
                    violao
                        ?.possuiInstrumento
                ).toBe(
                    true
                );

                expect(
                    piano
                        ?.possuiInstrumento
                ).toBe(
                    false
                );
            }
        );

        /**
         * =====================================================
         * 14
         * =====================================================
         */
        test(
            'não deve usar a informação de outro usuário para o mesmo instrumento',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                11,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },

                        {
                            usuarioId:
                                11,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                false,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                const aluno10 =
                    resultado.find(
                        (item) =>
                            item.usuarioId ===
                            10
                    );

                const aluno11 =
                    resultado.find(
                        (item) =>
                            item.usuarioId ===
                            11
                    );

                expect(
                    aluno10
                        ?.possuiInstrumento
                ).toBe(
                    true
                );

                expect(
                    aluno11
                        ?.possuiInstrumento
                ).toBe(
                    false
                );
            }
        );

        /**
         * =====================================================
         * 15
         * =====================================================
         */
        test(
            'deve preservar os dados originais do agendamento ao adicionar possuiInstrumento',
            async () => {
                const agendamento =
                    criarAgendamento({
                        id:
                            50,

                        usuarioId:
                            10,

                        instrumentoId:
                            1,
                    });

                agendamentoFindManyMock.mockResolvedValue(
                    [
                        agendamento,
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado[0]?.id
                ).toBe(
                    50
                );

                expect(
                    resultado[0]?.usuarioId
                ).toBe(
                    10
                );

                expect(
                    resultado[0]?.professorId
                ).toBe(
                    2
                );

                expect(
                    resultado[0]?.instrumentoId
                ).toBe(
                    1
                );

                expect(
                    resultado[0]?.status
                ).toBe(
                    'AGENDADO'
                );

                expect(
                    resultado[0]?.usuario
                ).toEqual(
                    agendamento.usuario
                );

                expect(
                    resultado[0]?.instrumento
                ).toEqual(
                    agendamento.instrumento
                );

                expect(
                    resultado[0]?.nivel
                ).toEqual(
                    agendamento.nivel
                );

                expect(
                    resultado[0]
                        ?.possuiInstrumento
                ).toBe(
                    true
                );
            }
        );

        /**
         * =====================================================
         * 16
         * =====================================================
         */
        test(
            'deve retornar corretamente os dados de endereço do aluno',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento(),
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado[0]
                        ?.usuario
                ).toEqual({
                    id:
                        10,

                    name:
                        'Aluno 10',

                    image:
                        null,

                    phone:
                        '61999999999',

                    logradouro:
                        'Rua Teste',

                    numero:
                        '100',

                    complemento:
                        null,

                    bairro:
                        'Centro',

                    cidade:
                        'Brasília',

                    uf:
                        'DF',
                });
            }
        );

        /**
         * =====================================================
         * 17
         * =====================================================
         */
        test(
            'deve retornar múltiplos agendamentos com seus respectivos valores de possuiInstrumento',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            dataHora:
                                criarDataFutura(
                                    1,
                                    9
                                ),
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                11,

                            instrumentoId:
                                2,

                            dataHora:
                                criarDataFutura(
                                    2,
                                    10
                                ),
                        }),

                        criarAgendamento({
                            id:
                                3,

                            usuarioId:
                                12,

                            instrumentoId:
                                1,

                            dataHora:
                                criarDataFutura(
                                    3,
                                    11
                                ),
                        }),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockResolvedValue(
                    [
                        {
                            usuarioId:
                                10,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },

                        {
                            usuarioId:
                                11,

                            instrumentoId:
                                2,

                            possuiInstrumento:
                                false,
                        },

                        {
                            usuarioId:
                                12,

                            instrumentoId:
                                1,

                            possuiInstrumento:
                                true,
                        },
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                const resultado =
                    await service.execute(
                        2
                    );

                expect(
                    resultado
                ).toHaveLength(
                    3
                );

                expect(
                    resultado[0]
                        ?.possuiInstrumento
                ).toBe(
                    true
                );

                expect(
                    resultado[1]
                        ?.possuiInstrumento
                ).toBe(
                    false
                );

                expect(
                    resultado[2]
                        ?.possuiInstrumento
                ).toBe(
                    true
                );
            }
        );

        /**
         * =====================================================
         * 18
         * =====================================================
         */
        test(
            'deve propagar erro do banco ao buscar agendamentos',
            async () => {
                agendamentoFindManyMock.mockRejectedValueOnce(
                    new Error(
                        'Erro ao buscar agendamentos'
                    )
                );

                const service =
                    new GetAgendamentosProfessorService();

                await expect(
                    service.execute(
                        2
                    )
                ).rejects.toThrow(
                    'Erro ao buscar agendamentos'
                );

                expect(
                    usuarioInstrumentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 19
         * =====================================================
         */
        test(
            'deve propagar erro do banco ao buscar instrumentos dos usuários',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento(),
                    ]
                );

                usuarioInstrumentoFindManyMock.mockRejectedValueOnce(
                    new Error(
                        'Erro ao buscar instrumentos do usuário'
                    )
                );

                const service =
                    new GetAgendamentosProfessorService();

                await expect(
                    service.execute(
                        2
                    )
                ).rejects.toThrow(
                    'Erro ao buscar instrumentos do usuário'
                );
            }
        );

        /**
         * =====================================================
         * 20
         * =====================================================
         */
        test(
            'deve consultar UsuarioInstrumento apenas uma vez mesmo com vários agendamentos',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento({
                            id:
                                1,

                            usuarioId:
                                10,

                            instrumentoId:
                                1,
                        }),

                        criarAgendamento({
                            id:
                                2,

                            usuarioId:
                                11,

                            instrumentoId:
                                2,
                        }),

                        criarAgendamento({
                            id:
                                3,

                            usuarioId:
                                12,

                            instrumentoId:
                                1,
                        }),
                    ]
                );

                const service =
                    new GetAgendamentosProfessorService();

                await service.execute(
                    2
                );

                expect(
                    usuarioInstrumentoFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );
    }
);