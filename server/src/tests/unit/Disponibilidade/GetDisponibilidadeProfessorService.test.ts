import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

const disponibilidadeFindManyMock =
    mock((_args: any) =>
        Promise.resolve<any>([])
    );

mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            disponibilidade: {
                findMany:
                    disponibilidadeFindManyMock,
            },
        },
    })
);

const {
    GetDisponibilidadeProfessorService,
} = await import(
    '../../../services/Disponibilidade/GetDisponibilidadeProfessorService'
);

function criarService() {
    return new GetDisponibilidadeProfessorService();
}

function criarDisponibilidade({
    id = 1,
    professorId = 2,
    horaInicio = new Date(
        '2030-10-10T09:00:00-03:00'
    ),
    horaFim = new Date(
        '2030-10-10T10:00:00-03:00'
    ),
}: {
    id?: number;
    professorId?: number;
    horaInicio?: Date;
    horaFim?: Date;
} = {}) {
    return {
        id,
        professorId,
        data:
            horaInicio,
        horaInicio,
        horaFim,
    };
}

beforeEach(() => {
    disponibilidadeFindManyMock.mockReset();

    disponibilidadeFindManyMock.mockResolvedValue(
        []
    );
});

describe(
    'GetDisponibilidadeProfessorService',
    () => {
        test(
            'deve retornar as disponibilidades do professor',
            async () => {
                const service =
                    criarService();

                const disponibilidades = [
                    criarDisponibilidade({
                        id: 1,
                    }),
                    criarDisponibilidade({
                        id: 2,
                    }),
                ];

                disponibilidadeFindManyMock.mockResolvedValue(
                    disponibilidades
                );

                const resultado =
                    await service.execute({
                        professorId: 2,
                    });

                expect(
                    resultado
                ).toEqual(
                    disponibilidades
                );

                expect(
                    resultado
                ).toHaveLength(2);
            }
        );

        test(
            'deve retornar array vazio quando professor não possuir disponibilidades futuras',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindManyMock.mockResolvedValue(
                    []
                );

                const resultado =
                    await service.execute({
                        professorId: 2,
                    });

                expect(
                    resultado
                ).toEqual([]);
            }
        );

        test(
            'deve rejeitar professorId zero',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 0,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    disponibilidadeFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar professorId negativo',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            -1,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    disponibilidadeFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar professorId não inteiro',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2.5,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    disponibilidadeFindManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve buscar somente disponibilidades do professor informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 77,
                });

                const chamada =
                    disponibilidadeFindManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where.professorId
                ).toBe(77);
            }
        );

        test(
            'deve buscar somente disponibilidades que ainda não passaram',
            async () => {
                const service =
                    criarService();

                const antes =
                    new Date();

                await service.execute({
                    professorId: 2,
                });

                const depois =
                    new Date();

                const chamada =
                    disponibilidadeFindManyMock
                        .mock
                        .calls[0]?.[0];

                const limite =
                    chamada.where
                        .horaInicio.gte;

                expect(
                    limite
                ).toBeInstanceOf(
                    Date
                );

                expect(
                    limite.getTime()
                ).toBeGreaterThanOrEqual(
                    antes.getTime()
                );

                expect(
                    limite.getTime()
                ).toBeLessThanOrEqual(
                    depois.getTime()
                );
            }
        );

        test(
            'deve ordenar disponibilidades por horaInicio crescente',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                });

                const chamada =
                    disponibilidadeFindManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.orderBy
                ).toEqual({
                    horaInicio:
                        'asc',
                });
            }
        );

        test(
            'não deve aplicar limite máximo de 14 dias',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                });

                const chamada =
                    disponibilidadeFindManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where
                        .horaInicio.gte
                ).toBeInstanceOf(
                    Date
                );

                expect(
                    chamada.where
                        .horaInicio.lte
                ).toBeUndefined();

                expect(
                    chamada.where
                        .horaInicio.lt
                ).toBeUndefined();
            }
        );

        test(
            'não deve aplicar filtro máximo de data na consulta',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                });

                const chamada =
                    disponibilidadeFindManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where
                ).toEqual({
                    professorId: 2,

                    horaInicio: {
                        gte:
                            expect.any(
                                Date
                            ),
                    },
                });
            }
        );

        test(
            'deve permitir que o Prisma retorne disponibilidade muito além de 14 dias',
            async () => {
                const service =
                    criarService();

                const distante =
                    criarDisponibilidade({
                        id: 100,

                        horaInicio:
                            new Date(
                                '2035-01-10T09:00:00-03:00'
                            ),

                        horaFim:
                            new Date(
                                '2035-01-10T10:00:00-03:00'
                            ),
                    });

                disponibilidadeFindManyMock.mockResolvedValue(
                    [distante]
                );

                const resultado =
                    await service.execute({
                        professorId: 2,
                    });

                expect(
                    resultado
                ).toEqual([
                    distante,
                ]);
            }
        );

        test(
            'deve fazer apenas uma consulta ao Prisma',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                });

                expect(
                    disponibilidadeFindManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        test(
            'deve propagar erro do Prisma',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindManyMock.mockRejectedValue(
                    new Error(
                        'Falha ao consultar disponibilidades'
                    )
                );

                await expect(
                    service.execute({
                        professorId: 2,
                    })
                ).rejects.toThrow(
                    'Falha ao consultar disponibilidades'
                );
            }
        );
    }
);