import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

// ============================================================
// MOCKS
// ============================================================

const agendamentoFindUniqueMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

const agendamentoFindFirstMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

const agendamentoUpdateMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

const disponibilidadeFindFirstMock =
    mock((_args: any) =>
        Promise.resolve<any>(null)
    );

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

const {
    RemarcarAgendamentoProfessorService,
} = await import(
    '../../../services/Agendamento/RemarcarAgendamentoProfessorService'
);

// ============================================================
// HELPERS
// ============================================================

function formatarDataSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-CA',
        {
            timeZone:
                'America/Sao_Paulo',

            year:
                'numeric',

            month:
                '2-digit',

            day:
                '2-digit',
        }
    ).format(data);
}

function adicionarDias(
    data: string,
    quantidade: number
): string {
    const partes =
        data.split('-');

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);

    const resultado =
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

    resultado.setUTCDate(
        resultado.getUTCDate() +
        quantidade
    );

    return [
        resultado.getUTCFullYear(),

        String(
            resultado.getUTCMonth() +
            1
        ).padStart(
            2,
            '0'
        ),

        String(
            resultado.getUTCDate()
        ).padStart(
            2,
            '0'
        ),
    ].join('-');
}

function criarDataHora(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

function criarAgendamento(
    overrides: Record<
        string,
        any
    > = {}
) {
    const dataFutura =
        new Date(
            Date.now() +
            7 *
            24 *
            60 *
            60 *
            1000
        );

    return {
        id: 10,

        usuarioId: 5,

        professorId: 2,

        instrumentoId: 1,

        nivelId: 1,

        dataHora:
            dataFutura,

        status:
            'AGENDADO',

        ...overrides,
    };
}

function criarDisponibilidade(
    dataHora: Date
) {
    return {
        id: 20,

        professorId: 2,

        data:
            dataHora,

        horaInicio:
            dataHora,

        horaFim:
            new Date(
                dataHora.getTime() +
                60 *
                60 *
                1000
            ),
    };
}

function criarService() {
    return new RemarcarAgendamentoProfessorService();
}

// ============================================================
// TESTES
// ============================================================

describe(
    'RemarcarAgendamentoProfessorService',
    () => {
        let hoje: string;
        let dataValida: string;
        let dataHoraValida: Date;

        const horarioValido =
            '14:00';

        beforeEach(() => {
            agendamentoFindUniqueMock.mockReset();

            agendamentoFindFirstMock.mockReset();

            agendamentoUpdateMock.mockReset();

            disponibilidadeFindFirstMock.mockReset();

            hoje =
                formatarDataSaoPaulo(
                    new Date()
                );

            dataValida =
                adicionarDias(
                    hoje,
                    2
                );

            dataHoraValida =
                criarDataHora(
                    dataValida,
                    horarioValido
                );

            agendamentoFindUniqueMock.mockResolvedValue(
                criarAgendamento()
            );

            disponibilidadeFindFirstMock.mockResolvedValue(
                criarDisponibilidade(
                    dataHoraValida
                )
            );

            agendamentoFindFirstMock.mockResolvedValue(
                null
            );

            agendamentoUpdateMock.mockResolvedValue(
                {
                    ...criarAgendamento(),

                    dataHora:
                        dataHoraValida,
                }
            );
        });

        test(
            'deve remarcar uma aula válida',
            async () => {
                const service =
                    criarService();

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,

                            agendamentoId:
                                10,

                            data:
                                dataValida,

                            horario:
                                horarioValido,
                        }
                    );

                expect(
                    resultado
                ).toBeDefined();

                expect(
                    resultado.dataHora.getTime()
                ).toBe(
                    dataHoraValida.getTime()
                );
            }
        );

        test(
            'deve rejeitar quando o agendamento não existir',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Agendamento não encontrado.'
                );
            }
        );

        test(
            'deve rejeitar quando o agendamento pertencer a outro professor',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    criarAgendamento({
                        professorId:
                            999,
                    })
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Você não tem permissão para remarcar esta aula.'
                );
            }
        );

        test(
            'deve rejeitar quando a aula não estiver com status AGENDADO',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    criarAgendamento({
                        status:
                            'CANCELADO',
                    })
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Esta aula não pode mais ser remarcada.'
                );
            }
        );

        test(
            'deve rejeitar quando a aula original já tiver passado',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    criarAgendamento({
                        dataHora:
                            new Date(
                                Date.now() -
                                60 *
                                60 *
                                1000
                            ),
                    })
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Não é possível remarcar uma aula que já passou.'
                );
            }
        );

        test(
            'deve rejeitar horário não permitido',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            '13:30',
                    })
                ).rejects.toThrow(
                    'Horário não permitido para agendamento.'
                );
            }
        );

        test(
            'deve rejeitar data inválida',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            'data-invalida',

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Data ou horário inválidos.'
                );
            }
        );

        test(
            'deve rejeitar data inexistente normalizada pelo JavaScript',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            '2026-02-31',

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Data ou horário inválidos.'
                );
            }
        );

        test(
            'deve rejeitar nova data ou horário no passado',
            async () => {
                const dataPassada =
                    adicionarDias(
                        hoje,
                        -1
                    );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataPassada,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Não é possível remarcar para uma data ou horário passado.'
                );
            }
        );

        test(
            'deve rejeitar remarcação para hoje',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            hoje,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow();
            }
        );

        test(
            'deve rejeitar remarcação após o limite de 14 dias',
            async () => {
                const dataForaLimite =
                    adicionarDias(
                        hoje,
                        15
                    );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataForaLimite,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'A aula deve ser remarcada entre amanhã e os próximos 14 dias.'
                );
            }
        );

        test(
            'deve rejeitar quando a nova data e horário forem iguais ao agendamento atual',
            async () => {
                agendamentoFindUniqueMock.mockResolvedValue(
                    criarAgendamento({
                        dataHora:
                            dataHoraValida,
                    })
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Escolha uma data ou horário diferente do agendamento atual.'
                );
            }
        );

        test(
            'deve rejeitar quando o professor não disponibilizou o horário',
            async () => {
                disponibilidadeFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Você não disponibilizou esse horário.'
                );
            }
        );

        test(
            'deve rejeitar quando o professor já possuir outra aula no horário',
            async () => {
                agendamentoFindFirstMock.mockResolvedValueOnce(
                    {
                        id: 99,
                    }
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Você já possui outra aula agendada nessa data e horário.'
                );
            }
        );

        test(
            'deve rejeitar quando o aluno já possuir outra aula no horário',
            async () => {
                agendamentoFindFirstMock
                    .mockResolvedValueOnce(
                        null
                    )
                    .mockResolvedValueOnce(
                        {
                            id: 99,
                        }
                    );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'O aluno já possui outra aula agendada nessa data e horário.'
                );
            }
        );

        test(
            'deve ignorar o próprio agendamento nas verificações de conflito',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data:
                        dataValida,

                    horario:
                        horarioValido,
                });

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledTimes(
                    2
                );

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

                            dataHora:
                                dataHoraValida,

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
                                5,

                            dataHora:
                                dataHoraValida,

                            status:
                                'AGENDADO',
                        },
                    }
                );
            }
        );

        test(
            'deve consultar disponibilidade usando o horário convertido de São Paulo',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data:
                        dataValida,

                    horario:
                        horarioValido,
                });

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            professorId:
                                2,

                            horaInicio:
                                dataHoraValida,
                        },
                    }
                );
            }
        );

        test(
            'deve atualizar somente a dataHora do agendamento',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId:
                        2,

                    agendamentoId:
                        10,

                    data:
                        dataValida,

                    horario:
                        horarioValido,
                });

                expect(
                    agendamentoUpdateMock
                ).toHaveBeenCalledWith(
                    {
                        where: {
                            id: 10,
                        },

                        data: {
                            dataHora:
                                dataHoraValida,
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

        test(
            'deve aceitar o último dia da janela de 14 dias',
            async () => {
                const ultimoDia =
                    adicionarDias(
                        hoje,
                        14
                    );

                const dataHora =
                    criarDataHora(
                        ultimoDia,
                        horarioValido
                    );

                disponibilidadeFindFirstMock.mockResolvedValue(
                    criarDisponibilidade(
                        dataHora
                    )
                );

                agendamentoUpdateMock.mockResolvedValue(
                    {
                        ...criarAgendamento(),

                        dataHora,
                    }
                );

                const service =
                    criarService();

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,

                            agendamentoId:
                                10,

                            data:
                                ultimoDia,

                            horario:
                                horarioValido,
                        }
                    );

                expect(
                    resultado.dataHora.getTime()
                ).toBe(
                    dataHora.getTime()
                );
            }
        );

        test(
            'deve aceitar amanhã como primeiro dia da janela',
            async () => {
                const amanha =
                    adicionarDias(
                        hoje,
                        1
                    );

                const dataHora =
                    criarDataHora(
                        amanha,
                        horarioValido
                    );

                disponibilidadeFindFirstMock.mockResolvedValue(
                    criarDisponibilidade(
                        dataHora
                    )
                );

                agendamentoUpdateMock.mockResolvedValue(
                    {
                        ...criarAgendamento(),

                        dataHora,
                    }
                );

                const service =
                    criarService();

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,

                            agendamentoId:
                                10,

                            data:
                                amanha,

                            horario:
                                horarioValido,
                        }
                    );

                expect(
                    resultado.dataHora.getTime()
                ).toBe(
                    dataHora.getTime()
                );
            }
        );

        // ====================================================
        // P2002
        // ====================================================

        test(
            'deve tratar conflito P2002 do aluno',
            async () => {
                agendamentoUpdateMock.mockRejectedValue(
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
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'O aluno já possui outra aula agendada nessa data e horário.'
                );
            }
        );

        test(
            'deve tratar conflito P2002 do professor',
            async () => {
                agendamentoUpdateMock.mockRejectedValue(
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
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Você já possui outra aula agendada nessa data e horário.'
                );
            }
        );

        test(
            'deve retornar mensagem genérica para outro conflito P2002',
            async () => {
                agendamentoUpdateMock.mockRejectedValue(
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
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Esse horário não está mais disponível.'
                );
            }
        );

        test(
            'deve propagar erro diferente de P2002',
            async () => {
                agendamentoUpdateMock.mockRejectedValue(
                    new Error(
                        'Falha inesperada no banco'
                    )
                );

                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId:
                            2,

                        agendamentoId:
                            10,

                        data:
                            dataValida,

                        horario:
                            horarioValido,
                    })
                ).rejects.toThrow(
                    'Falha inesperada no banco'
                );
            }
        );
    }
);