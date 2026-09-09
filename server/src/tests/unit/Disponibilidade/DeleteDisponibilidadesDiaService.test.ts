import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

const agendamentoFindFirstMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

const disponibilidadeCountMock =
    mock((_args: any) =>
        Promise.resolve<number>(1)
    );

const disponibilidadeDeleteManyMock =
    mock((_args: any) =>
        Promise.resolve<any>({
            count: 1,
        })
    );

mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            agendamento: {
                findFirst:
                    agendamentoFindFirstMock,
            },

            disponibilidade: {
                count:
                    disponibilidadeCountMock,

                deleteMany:
                    disponibilidadeDeleteManyMock,
            },
        },
    })
);

const {
    DeleteDisponibilidadesDiaService,
} = await import(
    '../../../services/Disponibilidade/DeleteDisponibilidadesDiaService'
);

function criarService() {
    return new DeleteDisponibilidadesDiaService();
}

const PROFESSOR_ID = 2;
const DATA = '2026-10-10';

function inicioDia(
    data = DATA
) {
    return new Date(
        `${data}T00:00:00-03:00`
    );
}

function fimDia(
    data = DATA
) {
    return new Date(
        inicioDia(
            data
        ).getTime() +
        24 *
        60 *
        60 *
        1000
    );
}

beforeEach(() => {
    agendamentoFindFirstMock.mockReset();

    disponibilidadeCountMock.mockReset();

    disponibilidadeDeleteManyMock.mockReset();

    agendamentoFindFirstMock.mockResolvedValue(
        null
    );

    disponibilidadeCountMock.mockResolvedValue(
        1
    );

    disponibilidadeDeleteManyMock.mockResolvedValue(
        {
            count: 1,
        }
    );
});

describe(
    'DeleteDisponibilidadesDiaService',
    () => {
        test(
            'deve remover todas as disponibilidades do dia',
            async () => {
                const service =
                    criarService();

                disponibilidadeCountMock.mockResolvedValue(
                    3
                );

                disponibilidadeDeleteManyMock.mockResolvedValue(
                    {
                        count: 3,
                    }
                );

                const resultado =
                    await service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    });

                expect(
                    disponibilidadeDeleteManyMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    resultado
                ).toEqual({
                    message:
                        'Horários do dia removidos com sucesso.',
                    quantidade:
                        3,
                });
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
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteManyMock
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
                        professorId: -1,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );
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
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );
            }
        );

        test(
            'deve rejeitar data fora do formato YYYY-MM-DD',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data:
                            '10/10/2026',
                    })
                ).rejects.toThrow(
                    'Data inválida. Utilize o formato YYYY-MM-DD.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar data inexistente',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data:
                            '2026-02-31',
                    })
                ).rejects.toThrow(
                    'Data inválida. Utilize o formato YYYY-MM-DD.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeCountMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar mês inexistente',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data:
                            '2026-13-10',
                    })
                ).rejects.toThrow(
                    'Data inválida. Utilize o formato YYYY-MM-DD.'
                );
            }
        );

        test(
            'deve buscar aula agendada no dia informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledWith({
                    where: {
                        professorId:
                            PROFESSOR_ID,

                        status:
                            'AGENDADO',

                        dataHora: {
                            gte:
                                inicioDia(),

                            lt:
                                fimDia(),
                        },
                    },
                });
            }
        );

        test(
            'deve considerar somente aulas com status AGENDADO',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                const chamada =
                    agendamentoFindFirstMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where.status
                ).toBe(
                    'AGENDADO'
                );
            }
        );

        test(
            'deve utilizar o professorId informado ao verificar agendamentos',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 77,
                    data: DATA,
                });

                const chamada =
                    agendamentoFindFirstMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where.professorId
                ).toBe(77);
            }
        );

        test(
            'deve bloquear exclusão quando existir aula agendada no dia',
            async () => {
                const service =
                    criarService();

                agendamentoFindFirstMock.mockResolvedValue(
                    {
                        id: 100,
                        professorId:
                            PROFESSOR_ID,
                        status:
                            'AGENDADO',
                        dataHora:
                            new Date(
                                `${DATA}T09:00:00-03:00`
                            ),
                    }
                );

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Existe uma aula agendada neste dia. Cancele a aula antes de remover todos os horários.'
                );

                expect(
                    disponibilidadeCountMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve consultar a quantidade de disponibilidades somente após verificar que não existe aula agendada',
            async () => {
                const service =
                    criarService();

                let agendamentoVerificado =
                    false;

                agendamentoFindFirstMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        agendamentoVerificado =
                            true;

                        return null;
                    }
                );

                disponibilidadeCountMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        expect(
                            agendamentoVerificado
                        ).toBe(true);

                        return 1;
                    }
                );

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                expect(
                    disponibilidadeCountMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        test(
            'deve contar somente disponibilidades do professor no dia informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                expect(
                    disponibilidadeCountMock
                ).toHaveBeenCalledWith({
                    where: {
                        professorId:
                            PROFESSOR_ID,

                        horaInicio: {
                            gte:
                                inicioDia(),

                            lt:
                                fimDia(),
                        },
                    },
                });
            }
        );

        test(
            'deve rejeitar quando nenhuma disponibilidade existir no dia',
            async () => {
                const service =
                    criarService();

                disponibilidadeCountMock.mockResolvedValue(
                    0
                );

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Nenhum horário encontrado nesta data.'
                );

                expect(
                    disponibilidadeDeleteManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve excluir somente disponibilidades do professor e do dia informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 44,
                    data: DATA,
                });

                expect(
                    disponibilidadeDeleteManyMock
                ).toHaveBeenCalledWith({
                    where: {
                        professorId:
                            44,

                        horaInicio: {
                            gte:
                                inicioDia(),

                            lt:
                                fimDia(),
                        },
                    },
                });
            }
        );

        test(
            'deve excluir somente depois de concluir todas as validações',
            async () => {
                const service =
                    criarService();

                let conflitoVerificado =
                    false;

                let disponibilidadeVerificada =
                    false;

                agendamentoFindFirstMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        conflitoVerificado =
                            true;

                        return null;
                    }
                );

                disponibilidadeCountMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        expect(
                            conflitoVerificado
                        ).toBe(true);

                        disponibilidadeVerificada =
                            true;

                        return 2;
                    }
                );

                disponibilidadeDeleteManyMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        expect(
                            conflitoVerificado
                        ).toBe(true);

                        expect(
                            disponibilidadeVerificada
                        ).toBe(true);

                        return {
                            count: 2,
                        };
                    }
                );

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                expect(
                    disponibilidadeDeleteManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        test(
            'deve retornar a quantidade realmente removida pelo Prisma',
            async () => {
                const service =
                    criarService();

                disponibilidadeCountMock.mockResolvedValue(
                    6
                );

                disponibilidadeDeleteManyMock.mockResolvedValue(
                    {
                        count: 4,
                    }
                );

                const resultado =
                    await service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    });

                expect(
                    resultado.quantidade
                ).toBe(4);
            }
        );

        test(
            'deve usar meia-noite de São Paulo como início do dia',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                const chamada =
                    disponibilidadeCountMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where
                        .horaInicio.gte
                ).toEqual(
                    new Date(
                        '2026-10-10T00:00:00-03:00'
                    )
                );
            }
        );

        test(
            'deve usar o início do dia seguinte como limite exclusivo',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        PROFESSOR_ID,
                    data: DATA,
                });

                const chamada =
                    disponibilidadeCountMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where
                        .horaInicio.lt
                ).toEqual(
                    new Date(
                        '2026-10-11T00:00:00-03:00'
                    )
                );
            }
        );

        test(
            'deve permitir remover disponibilidades de uma data futura distante',
            async () => {
                const service =
                    criarService();

                const data =
                    '2030-12-20';

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data,
                    })
                ).resolves.toEqual({
                    message:
                        'Horários do dia removidos com sucesso.',
                    quantidade:
                        1,
                });
            }
        );

        test(
            'deve propagar erro do banco ao verificar agendamentos',
            async () => {
                const service =
                    criarService();

                agendamentoFindFirstMock.mockRejectedValue(
                    new Error(
                        'Falha ao consultar agendamentos'
                    )
                );

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Falha ao consultar agendamentos'
                );

                expect(
                    disponibilidadeDeleteManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve propagar erro do banco ao contar disponibilidades',
            async () => {
                const service =
                    criarService();

                disponibilidadeCountMock.mockRejectedValue(
                    new Error(
                        'Falha ao contar disponibilidades'
                    )
                );

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Falha ao contar disponibilidades'
                );

                expect(
                    disponibilidadeDeleteManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve propagar erro do banco ao excluir disponibilidades',
            async () => {
                const service =
                    criarService();

                disponibilidadeDeleteManyMock.mockRejectedValue(
                    new Error(
                        'Falha ao excluir disponibilidades'
                    )
                );

                await expect(
                    service.execute({
                        professorId:
                            PROFESSOR_ID,
                        data: DATA,
                    })
                ).rejects.toThrow(
                    'Falha ao excluir disponibilidades'
                );
            }
        );
    }
);