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

const usuarioFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
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
            usuario: {
                findUnique:
                    usuarioFindUniqueMock,
            },

            agendamento: {
                findMany:
                    agendamentoFindManyMock,
            },
        },
    })
);

/**
 * Importar o service somente
 * depois de mockar o Prisma.
 */
const {
    GetAgendamentosService,
} = await import(
    '../../../services/Agendamento/GetAgendamentosService'
);

/**
 * =====================================================
 * HELPERS
 * =====================================================
 */

function criarDataFutura(
    dias = 2
): Date {
    const data =
        new Date();

    data.setDate(
        data.getDate() +
        dias
    );

    data.setHours(
        10,
        0,
        0,
        0
    );

    return data;
}

function criarAgendamento(
    id: number,
    dataHora: Date
) {
    return {
        id,

        usuarioId:
            1,

        professorId:
            2,

        instrumentoId:
            1,

        nivelId:
            1,

        dataHora,

        status:
            'AGENDADO' as const,

        createdAt:
            new Date(),

        professor: {
            id:
                2,

            name:
                'Professor Teste',

            clerkId:
                null,

            email:
                'professor@teste.com',

            phone:
                '61999999999',

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
    };
}

/**
 * =====================================================
 * TESTES
 * =====================================================
 */

describe(
    'GetAgendamentosService',
    () => {
        beforeEach(() => {
            usuarioFindUniqueMock.mockReset();

            agendamentoFindManyMock.mockReset();

            /**
             * Usuário válido por padrão.
             */
            usuarioFindUniqueMock.mockResolvedValue(
                {
                    id:
                        1,

                    name:
                        'Aluno Teste',

                    email:
                        'aluno@teste.com',
                }
            );

            /**
             * Por padrão:
             * nenhum agendamento.
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
            'deve rejeitar quando o usuário não existir',
            async () => {
                usuarioFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new GetAgendamentosService();

                await expect(
                    service.execute({
                        usuarioId:
                            999,
                    })
                ).rejects.toThrow(
                    'Usuário não encontrado.'
                );

                expect(
                    agendamentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 2
         * =====================================================
         */
        test(
            'deve buscar o usuário pelo id informado',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                expect(
                    usuarioFindUniqueMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            id:
                                1,
                        },
                    }
                );
            }
        );

        /**
         * =====================================================
         * 3
         * =====================================================
         */
        test(
            'deve retornar array vazio quando o usuário não possuir aulas futuras agendadas',
            async () => {
                agendamentoFindManyMock.mockResolvedValue(
                    []
                );

                const service =
                    new GetAgendamentosService();

                const resultado =
                    await service.execute({
                        usuarioId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual(
                    []
                );

                expect(
                    agendamentoFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 4
         * =====================================================
         */
        test(
            'deve buscar somente agendamentos do usuário informado',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.usuarioId
                ).toBe(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 5
         * =====================================================
         */
        test(
            'deve buscar somente aulas com status AGENDADO',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.where.status
                ).toBe(
                    'AGENDADO'
                );
            }
        );

        /**
         * =====================================================
         * 6
         * =====================================================
         */
        test(
            'deve buscar somente aulas com data futura ou atual',
            async () => {
                const antes =
                    new Date();

                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                const depois =
                    new Date();

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                const dataFiltro =
                    argumentos
                        .where
                        .dataHora
                        .gte as Date;

                expect(
                    dataFiltro
                ).toBeInstanceOf(
                    Date
                );

                expect(
                    dataFiltro.getTime()
                ).toBeGreaterThanOrEqual(
                    antes.getTime()
                );

                expect(
                    dataFiltro.getTime()
                ).toBeLessThanOrEqual(
                    depois.getTime()
                );
            }
        );

        /**
         * =====================================================
         * 7
         * =====================================================
         */
        test(
            'deve incluir professor, instrumento e nível nos agendamentos',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos.include
                ).toEqual({
                    professor:
                        true,

                    instrumento:
                        true,

                    nivel:
                        true,
                });
            }
        );

        /**
         * =====================================================
         * 8
         * =====================================================
         */
        test(
            'deve ordenar as aulas pela dataHora em ordem crescente',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

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
         * 9
         * =====================================================
         */
        test(
            'deve retornar os agendamentos encontrados',
            async () => {
                const agendamentos =
                    [
                        criarAgendamento(
                            10,
                            criarDataFutura(
                                1
                            )
                        ),

                        criarAgendamento(
                            11,
                            criarDataFutura(
                                2
                            )
                        ),
                    ];

                agendamentoFindManyMock.mockResolvedValue(
                    agendamentos
                );

                const service =
                    new GetAgendamentosService();

                const resultado =
                    await service.execute({
                        usuarioId:
                            1,
                    });

                expect(
                    resultado
                ).toEqual(
                    agendamentos
                );

                expect(
                    resultado
                ).toHaveLength(
                    2
                );
            }
        );

        /**
         * =====================================================
         * 10
         * =====================================================
         */
        test(
            'deve retornar os dados relacionados do agendamento',
            async () => {
                const dataHora =
                    criarDataFutura(
                        2
                    );

                agendamentoFindManyMock.mockResolvedValue(
                    [
                        criarAgendamento(
                            10,
                            dataHora
                        ),
                    ]
                );

                const service =
                    new GetAgendamentosService();

                const resultado =
                    await service.execute({
                        usuarioId:
                            1,
                    });

                const agendamento =
                    resultado[0];

                expect(
                    agendamento
                ).toBeDefined();

                expect(
                    agendamento?.professor
                ).toEqual({
                    id:
                        2,

                    name:
                        'Professor Teste',

                    clerkId:
                        null,

                    email:
                        'professor@teste.com',

                    phone:
                        '61999999999',

                    image:
                        null,
                });

                expect(
                    agendamento?.instrumento
                ).toEqual({
                    id:
                        1,

                    name:
                        'Violão',
                });

                expect(
                    agendamento?.nivel
                ).toEqual({
                    id:
                        1,

                    name:
                        'Iniciante',
                });

                expect(
                    agendamento?.createdAt
                ).toBeInstanceOf(
                    Date
                );
            }
        );

        /**
         * =====================================================
         * 11
         * =====================================================
         */
        test(
            'deve executar a consulta de agendamentos somente depois de validar o usuário',
            async () => {
                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                expect(
                    usuarioFindUniqueMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 12
         * =====================================================
         */
        test(
            'deve propagar erro do banco ao buscar o usuário',
            async () => {
                usuarioFindUniqueMock.mockRejectedValueOnce(
                    new Error(
                        'Erro ao acessar banco'
                    )
                );

                const service =
                    new GetAgendamentosService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,
                    })
                ).rejects.toThrow(
                    'Erro ao acessar banco'
                );

                expect(
                    agendamentoFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 13
         * =====================================================
         */
        test(
            'deve propagar erro do banco ao buscar os agendamentos',
            async () => {
                agendamentoFindManyMock.mockRejectedValueOnce(
                    new Error(
                        'Erro ao buscar agendamentos'
                    )
                );

                const service =
                    new GetAgendamentosService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,
                    })
                ).rejects.toThrow(
                    'Erro ao buscar agendamentos'
                );
            }
        );

        /**
         * =====================================================
         * 14
         * =====================================================
         */
        test(
            'deve montar corretamente a consulta completa do Prisma',
            async () => {
                const antes =
                    new Date();

                const service =
                    new GetAgendamentosService();

                await service.execute({
                    usuarioId:
                        1,
                });

                const depois =
                    new Date();

                const chamada =
                    agendamentoFindManyMock.mock.calls[0];

                const argumentos =
                    chamada?.[0] as any;

                expect(
                    argumentos
                        .where
                        .usuarioId
                ).toBe(
                    1
                );

                expect(
                    argumentos
                        .where
                        .status
                ).toBe(
                    'AGENDADO'
                );

                expect(
                    argumentos
                        .where
                        .dataHora
                        .gte
                ).toBeInstanceOf(
                    Date
                );

                expect(
                    argumentos
                        .where
                        .dataHora
                        .gte
                        .getTime()
                ).toBeGreaterThanOrEqual(
                    antes.getTime()
                );

                expect(
                    argumentos
                        .where
                        .dataHora
                        .gte
                        .getTime()
                ).toBeLessThanOrEqual(
                    depois.getTime()
                );

                expect(
                    argumentos.include
                ).toEqual({
                    professor:
                        true,

                    instrumento:
                        true,

                    nivel:
                        true,
                });

                expect(
                    argumentos.orderBy
                ).toEqual({
                    dataHora:
                        'asc',
                });
            }
        );
    }
);