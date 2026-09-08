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

const disponibilidadeFindFirstMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

const agendamentoFindFirstMock =
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

                findFirst:
                    agendamentoFindFirstMock,

                update:
                    agendamentoUpdateMock,
            },

            disponibilidade: {
                findFirst:
                    disponibilidadeFindFirstMock,
            },
        },
    })
);

/**
 * O service precisa ser importado
 * depois que o Prisma foi mockado.
 */
const {
    RemarcarAgendamentoService,
} = await import(
    '../../../services/Agendamento/RemarcarAgendamentoService'
);

/**
 * Cria uma data futura em horário permitido.
 */
function criarDataValida(
    dias = 2,
    hora = 9
) {
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
 * Cria o agendamento original.
 *
 * Ele fica, por padrão,
 * para daqui a 3 dias às 10:00.
 */
function criarAgendamentoOriginal() {
    const dataHora =
        new Date();

    dataHora.setDate(
        dataHora.getDate() +
        3
    );

    dataHora.setHours(
        10,
        0,
        0,
        0
    );

    return {
        id: 10,
        usuarioId: 1,
        professorId: 2,
        instrumentoId: 1,
        nivelId: 1,
        dataHora,
        status: 'AGENDADO',
    };
}

describe(
    'RemarcarAgendamentoService',
    () => {
        beforeEach(() => {
            agendamentoFindUniqueMock.mockReset();

            disponibilidadeFindFirstMock.mockReset();

            agendamentoFindFirstMock.mockReset();

            agendamentoUpdateMock.mockReset();

            /**
             * AGENDAMENTO EXISTENTE
             */
            agendamentoFindUniqueMock.mockResolvedValue(
                criarAgendamentoOriginal()
            );

            /**
             * PROFESSOR DISPONIBILIZOU
             * O HORÁRIO.
             */
            disponibilidadeFindFirstMock.mockResolvedValue(
                {
                    id: 100,
                    professorId: 2,
                }
            );

            /**
             * Por padrão:
             *
             * 1ª chamada -> conflito professor
             * 2ª chamada -> conflito aluno
             *
             * Nenhum conflito.
             */
            agendamentoFindFirstMock.mockResolvedValue(
                null
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
                        dataHora: Date;
                    };
                }) =>
                    Promise.resolve({
                        id: where.id,

                        usuarioId: 1,

                        professorId: 2,

                        instrumentoId: 1,

                        nivelId: 1,

                        dataHora:
                            data.dataHora,

                        status:
                            'AGENDADO',

                        professor: {
                            id: 2,

                            name:
                                'Professor Teste',
                        },

                        instrumento: {
                            id: 1,

                            name:
                                'Violão',
                        },

                        nivel: {
                            id: 1,

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
            'deve remarcar um agendamento válido',
            async () => {
                const service =
                    new RemarcarAgendamentoService();

                const dataHora =
                    criarDataValida(
                        2,
                        9
                    );

                const resultado =
                    await service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    });

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    resultado.id
                ).toBe(10);

                expect(
                    resultado.dataHora
                ).toEqual(
                    dataHora
                );

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledTimes(
                    2
                );
            }
        );

        /**
         * 2
         */
        test(
            'deve rejeitar quando o agendamento não existir',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId:
                            999,

                        dataHora:
                            criarDataValida(),
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
         * 3
         */
        test(
            'deve rejeitar quando o agendamento pertencer a outro usuário',
            async () => {
                const agendamento =
                    criarAgendamentoOriginal();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        usuarioId:
                            999,
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(),
                    })
                ).rejects.toThrow(
                    'Você não tem permissão para remarcar esta aula.'
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
            'deve rejeitar quando a aula não estiver com status AGENDADO',
            async () => {
                const agendamento =
                    criarAgendamentoOriginal();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        status:
                            'CANCELADO',
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(),
                    })
                ).rejects.toThrow(
                    'Esta aula não pode mais ser remarcada.'
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
            'deve rejeitar quando a aula original já tiver passado',
            async () => {
                const agendamento =
                    criarAgendamentoOriginal();

                const dataPassada =
                    new Date();

                dataPassada.setDate(
                    dataPassada.getDate() -
                    1
                );

                dataPassada.setHours(
                    9,
                    0,
                    0,
                    0
                );

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        dataHora:
                            dataPassada,
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(),
                    })
                ).rejects.toThrow(
                    'Não é possível remarcar uma aula que já passou.'
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
            'deve rejeitar nova data ou horário no passado',
            async () => {
                const dataHora =
                    new Date();

                dataHora.setDate(
                    dataHora.getDate() -
                    1
                );

                dataHora.setHours(
                    9,
                    0,
                    0,
                    0
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'Não é possível remarcar para uma data ou horário passado.'
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
            'deve rejeitar remarcação para hoje',
            async () => {
                const dataHora =
                    new Date();

                /**
                 * Colocamos o horário
                 * no final do dia para
                 * garantir que ele não
                 * seja interpretado como
                 * horário passado.
                 */
                dataHora.setHours(
                    23,
                    59,
                    59,
                    999
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'A aula deve ser remarcada entre amanhã e os próximos 14 dias.'
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 8
         */
        test(
            'deve rejeitar remarcação após o limite de 14 dias',
            async () => {
                const service =
                    new RemarcarAgendamentoService();

                const dataHora =
                    criarDataValida(
                        15,
                        9
                    );

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'A aula deve ser remarcada entre amanhã e os próximos 14 dias.'
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
            'deve rejeitar horário não permitido',
            async () => {
                const service =
                    new RemarcarAgendamentoService();

                const dataHora =
                    criarDataValida(
                        2,
                        13
                    );

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'Horário não permitido para agendamento.'
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
            'deve rejeitar quando a nova data e horário forem iguais ao agendamento atual',
            async () => {
                const agendamento =
                    criarAgendamentoOriginal();

                agendamentoFindUniqueMock.mockResolvedValue(
                    agendamento
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            new Date(
                                agendamento.dataHora
                            ),
                    })
                ).rejects.toThrow(
                    'Escolha uma data ou horário diferente do agendamento atual.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 11
         */
        test(
            'deve rejeitar quando o professor não tiver disponibilizado o horário',
            async () => {
                disponibilidadeFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(
                                2,
                                9
                            ),
                    })
                ).rejects.toThrow(
                    'O professor não disponibilizou esse horário.'
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 12
         */
        test(
            'deve rejeitar quando o professor já possuir outra aula no novo horário',
            async () => {
                const dataHora =
                    criarDataValida(
                        2,
                        9
                    );

                agendamentoFindFirstMock.mockResolvedValueOnce(
                    {
                        id: 50,

                        usuarioId: 99,

                        professorId: 2,

                        instrumentoId: 1,

                        nivelId: 1,

                        dataHora,

                        status:
                            'AGENDADO',
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'Esse horário não está mais disponível para esse professor.'
                );

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 13
         */
        test(
            'deve rejeitar quando o aluno já possuir outra aula no novo horário',
            async () => {
                const dataHora =
                    criarDataValida(
                        2,
                        9
                    );

                agendamentoFindFirstMock
                    .mockResolvedValueOnce(
                        null
                    )
                    .mockResolvedValueOnce(
                        {
                            id: 60,

                            usuarioId: 1,

                            professorId: 5,

                            instrumentoId: 1,

                            nivelId: 1,

                            dataHora,

                            status:
                                'AGENDADO',
                        }
                    );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora,
                    })
                ).rejects.toThrow(
                    'Você já possui outra aula agendada nessa data e horário.'
                );

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledTimes(
                    2
                );

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 14
         */
        test(
            'deve ignorar o próprio agendamento nas verificações de conflito',
            async () => {
                const dataHora =
                    criarDataValida(
                        2,
                        9
                    );

                const service =
                    new RemarcarAgendamentoService();

                await service.execute({
                    usuarioId: 1,

                    agendamentoId: 10,

                    dataHora,
                });

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenNthCalledWith(
                    1,
                    {
                        where: {
                            id: {
                                not: 10,
                            },

                            professorId:
                                2,

                            dataHora,

                            status:
                                'AGENDADO',
                        },
                    }
                );

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenNthCalledWith(
                    2,
                    {
                        where: {
                            id: {
                                not: 10,
                            },

                            usuarioId:
                                1,

                            dataHora,

                            status:
                                'AGENDADO',
                        },
                    }
                );
            }
        );

        /**
         * 15
         */
        test(
            'deve tratar conflito P2002 do aluno',
            async () => {
                agendamentoUpdateMock.mockRejectedValueOnce(
                    {
                        code:
                            'P2002',

                        meta: {
                            target: [
                                'usuarioId',
                                'dataHora',
                            ],
                        },
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(
                                2,
                                9
                            ),
                    })
                ).rejects.toThrow(
                    'Você já possui outra aula nessa data e horário.'
                );
            }
        );

        /**
         * 16
         */
        test(
            'deve tratar conflito P2002 do professor',
            async () => {
                agendamentoUpdateMock.mockRejectedValueOnce(
                    {
                        code:
                            'P2002',

                        meta: {
                            target: [
                                'professorId',
                                'dataHora',
                            ],
                        },
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(
                                2,
                                9
                            ),
                    })
                ).rejects.toThrow(
                    'Esse horário não está mais disponível para esse professor.'
                );
            }
        );

        /**
         * 17
         */
        test(
            'deve retornar mensagem genérica para outro conflito P2002',
            async () => {
                agendamentoUpdateMock.mockRejectedValueOnce(
                    {
                        code:
                            'P2002',

                        meta: {
                            target: [
                                'outroCampo',
                            ],
                        },
                    }
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(
                                2,
                                9
                            ),
                    })
                ).rejects.toThrow(
                    'Esse horário não está mais disponível.'
                );
            }
        );

        /**
         * 18
         */
        test(
            'deve propagar erro diferente de P2002',
            async () => {
                agendamentoUpdateMock.mockRejectedValueOnce(
                    new Error(
                        'Erro inesperado do banco'
                    )
                );

                const service =
                    new RemarcarAgendamentoService();

                await expect(
                    service.execute({
                        usuarioId: 1,

                        agendamentoId: 10,

                        dataHora:
                            criarDataValida(
                                2,
                                9
                            ),
                    })
                ).rejects.toThrow(
                    'Erro inesperado do banco'
                );
            }
        );
    }
);