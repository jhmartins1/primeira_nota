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
    RemarcarAgendamentoProfessorService,
} = await import(
    '../../../services/Agendamento/RemarcarAgendamentoProfessorService'
);

const TIME_ZONE =
    'America/Sao_Paulo';

/**
 * Retorna uma data em:
 *
 * YYYY-MM-DD
 *
 * usando o timezone de São Paulo.
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

/**
 * Soma ou subtrai dias de uma
 * data no formato YYYY-MM-DD.
 *
 * Essa implementação é compatível
 * com:
 *
 * noUncheckedIndexedAccess: true
 */
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

/**
 * Gera uma data futura válida.
 *
 * Ex:
 *
 * criarDataFutura(2)
 *
 * retorna daqui a 2 dias.
 */
function criarDataFutura(
    dias = 2
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

/**
 * Cria um Date representando
 * uma data/hora de São Paulo.
 *
 * O próprio service usa -03:00.
 */
function criarDataHoraSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

/**
 * Cria o agendamento original.
 *
 * Por padrão:
 *
 * daqui a 3 dias
 * às 10:00
 */
function criarAgendamentoOriginal() {
    const data =
        criarDataFutura(
            3
        );

    const dataHora =
        criarDataHoraSaoPaulo(
            data,
            '10:00'
        );

    return {
        id: 10,

        usuarioId: 1,

        professorId: 2,

        instrumentoId: 1,

        nivelId: 1,

        dataHora,

        status:
            'AGENDADO',
    };
}

describe(
    'RemarcarAgendamentoProfessorService',
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
             * HORÁRIO DISPONIBILIZADO
             * PELO PROFESSOR.
             */
            disponibilidadeFindFirstMock.mockResolvedValue(
                {
                    id: 100,

                    professorId:
                        2,
                }
            );

            /**
             * Por padrão:
             *
             * 1ª chamada:
             * conflito professor
             *
             * 2ª chamada:
             * conflito aluno
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
                            data.dataHora,

                        status:
                            'AGENDADO',

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
            'deve remarcar uma aula válida',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                const data =
                    criarDataFutura(
                        2
                    );

                const resultado =
                    await service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data,

                        horario:
                            '09:00',
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
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            999,

                        data:
                            criarDataFutura(),

                        horario:
                            '09:00',
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
            'deve rejeitar quando o agendamento pertencer a outro professor',
            async () => {
                const agendamento =
                    criarAgendamentoOriginal();

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        professorId:
                            999,
                    }
                );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(),

                        horario:
                            '09:00',
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
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(),

                        horario:
                            '09:00',
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

                agendamentoFindUniqueMock.mockResolvedValue(
                    {
                        ...agendamento,

                        dataHora:
                            dataPassada,
                    }
                );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(),

                        horario:
                            '09:00',
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
            'deve rejeitar horário não permitido',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(),

                        horario:
                            '13:00',
                    })
                ).rejects.toThrow(
                    'Horário não permitido para agendamento.'
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
         * 7
         */
        test(
            'deve rejeitar data inválida',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            'data-invalida',

                        horario:
                            '09:00',
                    })
                ).rejects.toThrow(
                    'Data ou horário inválidos.'
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
            'deve rejeitar data inexistente normalizada pelo JavaScript',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            '2026-02-31',

                        horario:
                            '09:00',
                    })
                ).rejects.toThrow(
                    'Data ou horário inválidos.'
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
            'deve rejeitar nova data ou horário no passado',
            async () => {
                const hoje =
                    formatarDataSaoPaulo(
                        new Date()
                    );

                const ontem =
                    adicionarDias(
                        hoje,
                        -1
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            ontem,

                        horario:
                            '09:00',
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
         * 10
         */
        test(
            'deve rejeitar remarcação para hoje',
            async () => {
                const hoje =
                    formatarDataSaoPaulo(
                        new Date()
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                try {
                    await service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            hoje,

                        horario:
                            '09:00',
                    });

                    throw new Error(
                        'O teste deveria ter lançado erro.'
                    );
                } catch (error: any) {
                    expect(
                        [
                            'Não é possível remarcar para uma data ou horário passado.',

                            'A aula deve ser remarcada entre amanhã e os próximos 14 dias.',
                        ]
                    ).toContain(
                        error.message
                    );
                }

                expect(
                    agendamentoUpdateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * 11
         */
        test(
            'deve rejeitar remarcação após o limite de 14 dias',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(
                                15
                            ),

                        horario:
                            '09:00',
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
         * 12
         */
        test(
            'deve rejeitar quando a nova data e horário forem iguais ao agendamento atual',
            async () => {
                const data =
                    criarDataFutura(
                        3
                    );

                const agendamento =
                {
                    ...criarAgendamentoOriginal(),

                    dataHora:
                        criarDataHoraSaoPaulo(
                            data,
                            '10:00'
                        ),
                };

                agendamentoFindUniqueMock.mockResolvedValue(
                    agendamento
                );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data,

                        horario:
                            '10:00',
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
         * 13
         */
        test(
            'deve rejeitar quando o professor não disponibilizou o horário',
            async () => {
                disponibilidadeFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(
                                2
                            ),

                        horario:
                            '09:00',
                    })
                ).rejects.toThrow(
                    'Você não disponibilizou esse horário.'
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
         * 14
         */
        test(
            'deve rejeitar quando o professor já possuir outra aula no horário',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const dataHora =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                agendamentoFindFirstMock.mockResolvedValueOnce(
                    {
                        id:
                            50,

                        usuarioId:
                            99,

                        professorId:
                            2,

                        dataHora,

                        status:
                            'AGENDADO',
                    }
                );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data,

                        horario:
                            '09:00',
                    })
                ).rejects.toThrow(
                    'Você já possui outra aula agendada nessa data e horário.'
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
         * 15
         */
        test(
            'deve rejeitar quando o aluno já possuir outra aula no horário',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const dataHora =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                agendamentoFindFirstMock
                    .mockResolvedValueOnce(
                        null
                    )
                    .mockResolvedValueOnce(
                        {
                            id:
                                60,

                            usuarioId:
                                1,

                            professorId:
                                99,

                            dataHora,

                            status:
                                'AGENDADO',
                        }
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data,

                        horario:
                            '09:00',
                    })
                ).rejects.toThrow(
                    'O aluno já possui outra aula agendada nessa data e horário.'
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
         * 16
         */
        test(
            'deve ignorar o próprio agendamento nas verificações de conflito',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const dataHora =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data,

                    horario:
                        '09:00',
                });

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenNthCalledWith(
                    1,
                    {
                        where: {
                            id: {
                                not:
                                    10,
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
                                not:
                                    10,
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
         * 17
         */
        test(
            'deve consultar disponibilidade usando o horário convertido de São Paulo',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const dataHora =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data,

                    horario:
                        '09:00',
                });

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            professorId:
                                2,

                            horaInicio:
                                dataHora,
                        },
                    }
                );
            }
        );

        /**
         * 18
         */
        test(
            'deve atualizar somente a dataHora do agendamento',
            async () => {
                const data =
                    criarDataFutura(
                        2
                    );

                const dataHora =
                    criarDataHoraSaoPaulo(
                        data,
                        '09:00'
                    );

                const service =
                    new RemarcarAgendamentoProfessorService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data,

                    horario:
                        '09:00',
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
                            dataHora,
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
         * 19
         */
        test(
            'deve aceitar o último dia da janela de 14 dias',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                const resultado =
                    await service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(
                                14
                            ),

                        horario:
                            '09:00',
                    });

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * 20
         */
        test(
            'deve aceitar amanhã como primeiro dia da janela',
            async () => {
                const service =
                    new RemarcarAgendamentoProfessorService();

                const resultado =
                    await service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            criarDataFutura(
                                1
                            ),

                        horario:
                            '09:00',
                    });

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );
    }
);