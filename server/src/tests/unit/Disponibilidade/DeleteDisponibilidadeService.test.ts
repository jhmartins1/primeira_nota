import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

const disponibilidadeFindUniqueMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

const disponibilidadeDeleteMock =
    mock((_args: any) =>
        Promise.resolve<any>({
            id: 1,
        })
    );

const agendamentoFindFirstMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            disponibilidade: {
                findUnique:
                    disponibilidadeFindUniqueMock,

                delete:
                    disponibilidadeDeleteMock,
            },

            agendamento: {
                findFirst:
                    agendamentoFindFirstMock,
            },
        },
    })
);

const {
    DeleteDisponibilidadeService,
} = await import(
    '../../../services/Disponibilidade/DeleteDisponibilidadeService'
);

function criarDisponibilidade({
    id = 10,
    professorId = 2,
    horaInicio = new Date(
        '2026-10-10T09:00:00-03:00'
    ),
    horaFim = new Date(
        '2026-10-10T10:00:00-03:00'
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

        createdAt:
            new Date(),
    };
}

function criarService() {
    return new DeleteDisponibilidadeService();
}

beforeEach(() => {
    disponibilidadeFindUniqueMock.mockReset();

    disponibilidadeDeleteMock.mockReset();

    agendamentoFindFirstMock.mockReset();

    disponibilidadeFindUniqueMock.mockResolvedValue(
        criarDisponibilidade()
    );

    agendamentoFindFirstMock.mockResolvedValue(
        null
    );

    disponibilidadeDeleteMock.mockResolvedValue(
        criarDisponibilidade()
    );
});

describe(
    'DeleteDisponibilidadeService',
    () => {
        test(
            'deve remover uma disponibilidade válida',
            async () => {
                const service =
                    criarService();

                const resultado =
                    await service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    });

                expect(
                    disponibilidadeDeleteMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    resultado
                ).toEqual({
                    message:
                        'Disponibilidade removida com sucesso.',
                });
            }
        );

        test(
            'deve buscar a disponibilidade pelo id informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        55,
                });

                expect(
                    disponibilidadeFindUniqueMock
                ).toHaveBeenCalledWith({
                    where: {
                        id: 55,
                    },
                });
            }
        );

        test(
            'deve rejeitar professorId inválido',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 0,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    disponibilidadeFindUniqueMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteMock
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
                            -5,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );
            }
        );

        test(
            'deve rejeitar disponibilidadeId inválido',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            0,
                    })
                ).rejects.toThrow(
                    'Disponibilidade inválida.'
                );

                expect(
                    disponibilidadeFindUniqueMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar disponibilidade inexistente',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindUniqueMock.mockResolvedValue(
                    null
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Disponibilidade não encontrada.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve impedir professor de excluir disponibilidade de outro professor',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindUniqueMock.mockResolvedValue(
                    criarDisponibilidade({
                        professorId:
                            99,
                    })
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Disponibilidade não encontrada.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    disponibilidadeDeleteMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve verificar agendamento conflitante antes de excluir',
            async () => {
                const service =
                    criarService();

                const horaInicio =
                    new Date(
                        '2026-10-10T09:00:00-03:00'
                    );

                const horaFim =
                    new Date(
                        '2026-10-10T10:00:00-03:00'
                    );

                disponibilidadeFindUniqueMock.mockResolvedValue(
                    criarDisponibilidade({
                        horaInicio,
                        horaFim,
                    })
                );

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        10,
                });

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledWith({
                    where: {
                        professorId:
                            2,

                        status:
                            'AGENDADO',

                        dataHora: {
                            gte:
                                horaInicio,

                            lt:
                                horaFim,
                        },
                    },
                });
            }
        );

        test(
            'deve considerar somente agendamentos com status AGENDADO',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        10,
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
            'deve considerar o intervalo da disponibilidade ao buscar conflito',
            async () => {
                const service =
                    criarService();

                const horaInicio =
                    new Date(
                        '2026-11-20T14:00:00-03:00'
                    );

                const horaFim =
                    new Date(
                        '2026-11-20T15:00:00-03:00'
                    );

                disponibilidadeFindUniqueMock.mockResolvedValue(
                    criarDisponibilidade({
                        horaInicio,
                        horaFim,
                    })
                );

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        10,
                });

                const chamada =
                    agendamentoFindFirstMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.where.dataHora
                ).toEqual({
                    gte:
                        horaInicio,

                    lt:
                        horaFim,
                });
            }
        );

        test(
            'deve rejeitar exclusão quando existir aula agendada no horário',
            async () => {
                const service =
                    criarService();

                agendamentoFindFirstMock.mockResolvedValue(
                    {
                        id: 100,
                        professorId:
                            2,
                        status:
                            'AGENDADO',
                    }
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Já existe uma aula agendada nesse horário. Cancele a aula antes de remover este horário.'
                );

                expect(
                    disponibilidadeDeleteMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve excluir somente depois de validar que não existe conflito',
            async () => {
                const service =
                    criarService();

                let conflitoVerificado =
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

                disponibilidadeDeleteMock.mockImplementation(
                    async (
                        _args: any
                    ) => {
                        expect(
                            conflitoVerificado
                        ).toBe(
                            true
                        );

                        return criarDisponibilidade();
                    }
                );

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        10,
                });

                expect(
                    disponibilidadeDeleteMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        test(
            'deve excluir exatamente o id informado',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    disponibilidadeId:
                        42,
                });

                expect(
                    disponibilidadeDeleteMock
                ).toHaveBeenCalledWith({
                    where: {
                        id: 42,
                    },
                });
            }
        );

        test(
            'não deve excluir quando a validação de propriedade falhar',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindUniqueMock.mockResolvedValue(
                    criarDisponibilidade({
                        professorId:
                            3,
                    })
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow();

                expect(
                    disponibilidadeDeleteMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve propagar erro do banco ao buscar disponibilidade',
            async () => {
                const service =
                    criarService();

                disponibilidadeFindUniqueMock.mockRejectedValue(
                    new Error(
                        'Erro ao consultar banco'
                    )
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Erro ao consultar banco'
                );
            }
        );

        test(
            'deve propagar erro do banco ao verificar agendamento conflitante',
            async () => {
                const service =
                    criarService();

                agendamentoFindFirstMock.mockRejectedValue(
                    new Error(
                        'Falha ao consultar agendamento'
                    )
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Falha ao consultar agendamento'
                );

                expect(
                    disponibilidadeDeleteMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve propagar erro do banco ao excluir disponibilidade',
            async () => {
                const service =
                    criarService();

                disponibilidadeDeleteMock.mockRejectedValue(
                    new Error(
                        'Falha ao excluir disponibilidade'
                    )
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        disponibilidadeId:
                            10,
                    })
                ).rejects.toThrow(
                    'Falha ao excluir disponibilidade'
                );
            }
        );
    }
);