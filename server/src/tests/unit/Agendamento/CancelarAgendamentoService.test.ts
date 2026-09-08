import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

/**
 * MOCKS
 */

const agendamentoFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

const agendamentoUpdateMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

/**
 * MOCK DO PRISMA
 */
mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            agendamento: {
                findUnique:
                    agendamentoFindUniqueMock,

                update:
                    agendamentoUpdateMock,
            },
        },
    })
);

/**
 * Importar o service somente
 * depois de mockar o Prisma.
 */
const {
    CancelarAgendamentoService,
} = await import(
    '../../../services/Agendamento/CancelarAgendamentoService'
);

/**
 * Cria uma data futura.
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

/**
 * Cria um agendamento padrão.
 */
function criarAgendamento() {
    return {
        id:
            10,

        usuarioId:
            1,

        professorId:
            2,

        instrumentoId:
            1,

        nivelId:
            1,

        dataHora:
            criarDataFutura(
                2,
                10
            ),

        status:
            'AGENDADO',
    };
}

describe(
    'CancelarAgendamentoService',
    () => {
        beforeEach(() => {
            agendamentoFindUniqueMock.mockReset();

            agendamentoUpdateMock.mockReset();

            /**
             * AGENDAMENTO EXISTENTE
             */
            agendamentoFindUniqueMock.mockResolvedValue(
                criarAgendamento()
            );

            /**
             * UPDATE BEM-SUCEDIDO
             */
            agendamentoUpdateMock.mockImplementation(
                ({
                    where,
                    data,
                }: {
                    where: {
                        id: number;
                    };

                    data: {
                        status: string;
                    };
                }) =>
                    Promise.resolve({
                        id:
                            where.id,

                        usuarioId:
                            1,

                        professorId:
                            2,

                        instrumentoId:
                            1,

                        nivelId:
                            1,

                        dataHora:
                            criarDataFutura(
                                2,
                                10
                            ),

                        status:
                            data.status,

                        usuario: {
                            id:
                                1,

                            name:
                                'Aluno Teste',
                        },

                        professor: {
                            id:
                                2,

                            name:
                                'Professor Teste',
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
                    })
            );
        });

        /**
         * 1
         */
        test(
            'deve permitir que o aluno cancele a própria aula',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                const resultado =
                    await service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            10,
                    });

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    resultado.id
                ).toBe(
                    10
                );

                expect(
                    resultado.status
                ).toBe(
                    'CANCELADO'
                );

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * 2
         */
        test(
            'deve permitir que o professor cancele uma aula vinculada a ele',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                const resultado =
                    await service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,
                    });

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    resultado.status
                ).toBe(
                    'CANCELADO'
                );

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * 3
         */
        test(
            'deve rejeitar quando o agendamento não existir',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            999,
                    })
                ).rejects.toThrow(
                    'Agendamento não encontrado.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 4
         */
        test(
            'deve rejeitar quando o aluno tentar cancelar uma aula de outro aluno',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            999,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Você não tem permissão para cancelar esta aula.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 5
         */
        test(
            'deve rejeitar quando o professor tentar cancelar uma aula de outro professor',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        professorId:
                            999,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Você não tem permissão para cancelar esta aula.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 6
         */
        test(
            'deve rejeitar quando nenhum usuarioId nem professorId forem informados',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Você não tem permissão para cancelar esta aula.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 7
         */
        test(
            'deve permitir quando usuarioId e professorId forem informados e um deles pertencer ao agendamento',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                const resultado =
                    await service.execute({
                        usuarioId:
                            999,

                        professorId:
                            2,

                        agendamentoId:
                            10,
                    });

                expect(
                    resultado.status
                ).toBe(
                    'CANCELADO'
                );

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * 8
         */
        test(
            'deve rejeitar quando a aula não estiver mais com status AGENDADO',
            async () => {
                const agendamento =
                    criarAgendamento();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        status:
                            'CANCELADO',
                    }
                );

                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Esta aula não está mais agendada.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 9
         */
        test(
            'deve rejeitar quando a aula já tiver passado',
            async () => {
                const dataPassada =
                    new Date();

                dataPassada.setDate(
                    dataPassada.getDate() -
                    1
                );

                const agendamento =
                    criarAgendamento();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        dataHora:
                            dataPassada,
                    }
                );

                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Não é possível cancelar uma aula que já passou.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 10
         */
        test(
            'deve rejeitar aula exatamente no horário atual',
            async () => {
                const agendamento =
                    criarAgendamento();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        dataHora:
                            new Date(),
                    }
                );

                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Não é possível cancelar uma aula que já passou.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 11
         */
        test(
            'deve alterar somente o status para CANCELADO',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await service.execute({
                    usuarioId:
                        1,

                    agendamentoId:
                        10,
                });

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            id:
                                10,
                        },

                        data: {
                            status:
                                'CANCELADO',
                        },

                        include: {
                            usuario:
                                true,

                            professor:
                                true,

                            instrumento:
                                true,

                            nivel:
                                true,
                        },
                    }
                );
            }
        );

        /**
         * 12
         */
        test(
            'deve preservar o registro e cancelar usando update',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await service.execute({
                    usuarioId:
                        1,

                    agendamentoId:
                        10,
                });

                expect(
                    agendamentoFindUniqueMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * 13
         */
        test(
            'deve buscar o agendamento pelo id informado',
            async () => {
                const service =
                    new CancelarAgendamentoService();

                await service.execute({
                    usuarioId:
                        1,

                    agendamentoId:
                        10,
                });

                expect(
                    agendamentoFindUniqueMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            id:
                                10,
                        },
                    }
                );
            }
        );

        /**
         * 14
         */
        test(
            'deve propagar erro do banco durante o cancelamento',
            async () => {
                agendamentoUpdateMock.mockRejectedValueOnce(
                    new Error(
                        'Erro inesperado do banco'
                    )
                );

                const service =
                    new CancelarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId:
                            1,

                        agendamentoId:
                            10,
                    })
                ).rejects.toThrow(
                    'Erro inesperado do banco'
                );
            }
        );
    }
);