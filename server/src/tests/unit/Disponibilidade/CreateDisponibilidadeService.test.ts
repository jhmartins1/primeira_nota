import {
    beforeEach,
    describe,
    expect,
    mock,
    test,
} from 'bun:test';

const disponibilidadeCreateManyMock =
    mock((_args: any) =>
        Promise.resolve<any>({
            count: 1,
        })
    );

mock.module(
    '../../../prisma/client',
    () => ({
        prisma: {
            disponibilidade: {
                createMany:
                    disponibilidadeCreateManyMock,
            },
        },
    })
);

const {
    CreateDisponibilidadeService,
} = await import(
    '../../../services/Disponibilidade/CreateDisponibilidadeService'
);

function criarDataFutura(
    dias = 30
): string {
    const agora =
        new Date();

    const dataSaoPaulo =
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(agora);

    const [
        anoTexto,
        mesTexto,
        diaTexto,
    ] = dataSaoPaulo.split('-');

    const ano =
        Number(anoTexto);

    const mes =
        Number(mesTexto);

    const dia =
        Number(diaTexto);

    const data =
        new Date(
            Date.UTC(
                ano,
                mes - 1,
                dia + dias,
                12,
                0,
                0
            )
        );

    return [
        data.getUTCFullYear(),
        String(
            data.getUTCMonth() + 1
        ).padStart(2, '0'),
        String(
            data.getUTCDate()
        ).padStart(2, '0'),
    ].join('-');
}

function criarDataPassada(): string {
    return criarDataFutura(
        -30
    );
}

function criarDataMuitoFutura(): string {
    return criarDataFutura(
        365
    );
}

function criarService() {
    return new CreateDisponibilidadeService();
}

beforeEach(() => {
    disponibilidadeCreateManyMock.mockReset();

    disponibilidadeCreateManyMock.mockResolvedValue(
        {
            count: 1,
        }
    );
});

describe(
    'CreateDisponibilidadeService',
    () => {
        test(
            'deve criar uma disponibilidade válida',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataFutura();

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,
                            dataInicial,
                            horarios: [
                                '09:00',
                            ],
                        }
                    );

                expect(
                    disponibilidadeCreateManyMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    resultado
                ).toEqual({
                    message:
                        'Horários adicionados com sucesso.',
                    quantidadeCriada:
                        1,
                    quantidadeSolicitada:
                        1,
                });
            }
        );

        test(
            'deve criar múltiplos horários no mesmo dia',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataFutura();

                disponibilidadeCreateManyMock.mockResolvedValue(
                    {
                        count: 3,
                    }
                );

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,
                            dataInicial,
                            horarios: [
                                '09:00',
                                '10:00',
                                '11:00',
                            ],
                        }
                    );

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada
                ).toBeDefined();

                expect(
                    chamada.data
                ).toHaveLength(3);

                expect(
                    resultado.quantidadeCriada
                ).toBe(3);

                expect(
                    resultado.quantidadeSolicitada
                ).toBe(3);
            }
        );

        test(
            'deve remover horários duplicados antes de salvar',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataFutura();

                await service.execute({
                    professorId: 2,
                    dataInicial,
                    horarios: [
                        '09:00',
                        '09:00',
                        '10:00',
                        '10:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.data
                ).toHaveLength(2);
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
                        dataInicial:
                            criarDataFutura(),
                        horarios: [
                            '09:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Professor inválido.'
                );

                expect(
                    disponibilidadeCreateManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar lista de horários vazia',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            criarDataFutura(),
                        horarios: [],
                    })
                ).rejects.toThrow(
                    'Informe pelo menos um horário.'
                );

                expect(
                    disponibilidadeCreateManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar data com formato inválido',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            '10/10/2026',
                        horarios: [
                            '09:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Data inicial inválida.'
                );
            }
        );

        test(
            'deve rejeitar data inexistente',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            '2026-02-31',
                        horarios: [
                            '09:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Data inicial inválida.'
                );

                expect(
                    disponibilidadeCreateManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve rejeitar horário não permitido',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            criarDataFutura(),
                        horarios: [
                            '12:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Existe um horário inválido.'
                );

                expect(
                    disponibilidadeCreateManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve aceitar todos os horários permitidos',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataFutura();

                await service.execute({
                    professorId: 2,
                    dataInicial,
                    horarios: [
                        '09:00',
                        '10:00',
                        '11:00',
                        '14:00',
                        '15:00',
                        '16:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.data
                ).toHaveLength(6);
            }
        );

        test(
            'deve rejeitar quando todos os horários estiverem no passado',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            criarDataPassada(),
                        horarios: [
                            '09:00',
                            '10:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Nenhum horário futuro válido foi informado.'
                );

                expect(
                    disponibilidadeCreateManyMock
                ).not.toHaveBeenCalled();
            }
        );

        test(
            'deve permitir criar disponibilidade muito além de 14 dias',
            async () => {
                const service =
                    criarService();

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            criarDataMuitoFutura(),
                        horarios: [
                            '09:00',
                        ],
                    })
                ).resolves.toEqual({
                    message:
                        'Horários adicionados com sucesso.',
                    quantidadeCriada:
                        1,
                    quantidadeSolicitada:
                        1,
                });

                expect(
                    disponibilidadeCreateManyMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        test(
            'deve criar horaFim exatamente uma hora após horaInicio',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    dataInicial:
                        criarDataFutura(),
                    horarios: [
                        '14:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                const registro =
                    chamada.data[0];

                expect(
                    registro.horaFim.getTime() -
                    registro.horaInicio.getTime()
                ).toBe(
                    60 * 60 * 1000
                );
            }
        );

        test(
            'deve converter o horário usando o fuso de São Paulo',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataMuitoFutura();

                await service.execute({
                    professorId: 2,
                    dataInicial,
                    horarios: [
                        '09:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                const registro =
                    chamada.data[0];

                expect(
                    registro.horaInicio
                ).toEqual(
                    new Date(
                        `${dataInicial}T09:00:00-03:00`
                    )
                );

                expect(
                    registro.horaFim
                ).toEqual(
                    new Date(
                        `${dataInicial}T10:00:00-03:00`
                    )
                );
            }
        );

        test(
            'deve preencher professorId e data corretamente',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataMuitoFutura();

                await service.execute({
                    professorId: 77,
                    dataInicial,
                    horarios: [
                        '10:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                const registro =
                    chamada.data[0];

                expect(
                    registro.professorId
                ).toBe(77);

                expect(
                    registro.data
                ).toEqual(
                    registro.horaInicio
                );
            }
        );

        test(
            'deve usar skipDuplicates ao criar disponibilidades',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    dataInicial:
                        criarDataFutura(),
                    horarios: [
                        '09:00',
                    ],
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.skipDuplicates
                ).toBe(true);
            }
        );

        test(
            'deve retornar quantidade criada informada pelo Prisma',
            async () => {
                const service =
                    criarService();

                disponibilidadeCreateManyMock.mockResolvedValue(
                    {
                        count: 2,
                    }
                );

                const resultado =
                    await service.execute(
                        {
                            professorId:
                                2,
                            dataInicial:
                                criarDataFutura(),
                            horarios: [
                                '09:00',
                                '10:00',
                                '11:00',
                            ],
                        }
                    );

                expect(
                    resultado.quantidadeCriada
                ).toBe(2);

                expect(
                    resultado.quantidadeSolicitada
                ).toBe(3);
            }
        );

        test(
            'deve repetir disponibilidades pelos próximos 14 dias corridos considerando apenas dias úteis',
            async () => {
                const service =
                    criarService();

                const dataInicial =
                    criarDataMuitoFutura();

                await service.execute({
                    professorId: 2,
                    dataInicial,
                    horarios: [
                        '09:00',
                    ],
                    repetirProximos14Dias:
                        true,
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                expect(
                    chamada.data.length
                ).toBeGreaterThan(0);

                expect(
                    chamada.data.length
                ).toBeLessThanOrEqual(
                    10
                );
            }
        );

        test(
            'não deve criar disponibilidades em sábado ou domingo durante repetição',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    dataInicial:
                        criarDataMuitoFutura(),
                    horarios: [
                        '09:00',
                    ],
                    repetirProximos14Dias:
                        true,
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                for (
                    const registro of
                    chamada.data
                ) {
                    const dataSaoPaulo =
                        new Date(
                            registro.horaInicio
                        );

                    const diaSemana =
                        Number(
                            new Intl.DateTimeFormat(
                                'en-US',
                                {
                                    timeZone:
                                        'America/Sao_Paulo',
                                    weekday:
                                        'short',
                                }
                            ).formatToParts(
                                dataSaoPaulo
                            )[0]
                                ?.value ===
                                'Sun'
                                ? 0
                                : new Intl.DateTimeFormat(
                                    'en-US',
                                    {
                                        timeZone:
                                            'America/Sao_Paulo',
                                        weekday:
                                            'short',
                                    }
                                ).format(
                                    dataSaoPaulo
                                ) ===
                                    'Sat'
                                    ? 6
                                    : 1
                        );

                    expect(
                        diaSemana
                    ).not.toBe(0);

                    expect(
                        diaSemana
                    ).not.toBe(6);
                }
            }
        );

        test(
            'deve manter horários duplicados removidos também durante repetição',
            async () => {
                const service =
                    criarService();

                await service.execute({
                    professorId: 2,
                    dataInicial:
                        criarDataMuitoFutura(),
                    horarios: [
                        '09:00',
                        '09:00',
                    ],
                    repetirProximos14Dias:
                        true,
                });

                const chamada =
                    disponibilidadeCreateManyMock
                        .mock
                        .calls[0]?.[0];

                const chaves =
                    chamada.data.map(
                        (
                            registro: any
                        ) =>
                            `${registro.professorId}_${registro.horaInicio.getTime()}`
                    );

                expect(
                    new Set(chaves)
                        .size
                ).toBe(
                    chaves.length
                );
            }
        );

        test(
            'deve propagar erro do Prisma ao criar disponibilidades',
            async () => {
                const service =
                    criarService();

                disponibilidadeCreateManyMock.mockRejectedValue(
                    new Error(
                        'Banco indisponível'
                    )
                );

                await expect(
                    service.execute({
                        professorId: 2,
                        dataInicial:
                            criarDataFutura(),
                        horarios: [
                            '09:00',
                        ],
                    })
                ).rejects.toThrow(
                    'Banco indisponível'
                );
            }
        );
    }
);