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
            Promise.resolve<any>({
                id: 1,
                name: 'João',
            })
    );

const professorFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 2,
                name: 'Professor Teste',
            })
    );

const instrumentoFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 1,
                name: 'Violão',
            })
    );

const nivelFindUniqueMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 1,
                name: 'Iniciante',
            })
    );

const usuarioInstrumentoFindFirstMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 1,
                usuarioId: 1,
                instrumentoId: 1,
                nivelId: 1,
            })
    );

const professorInstrumentoFindFirstMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 1,
                professorId: 2,
                instrumentoId: 1,
                nivelId: 1,
            })
    );

/**
 * NOVO:
 * representa um horário que o professor
 * realmente disponibilizou.
 */
const disponibilidadeFindFirstMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>({
                id: 1,
                professorId: 2,
                data: new Date(),
                horaInicio: new Date(),
                horaFim: new Date(),
            })
    );

const agendamentoFindFirstMock =
    mock(
        (_args: any) =>
            Promise.resolve<any>(
                null
            )
    );

const agendamentoCreateMock =
    mock(
        ({
            data,
        }: {
            data: any;
        }) =>
            Promise.resolve<any>({
                id: 10,
                ...data,

                professor: {
                    id: 2,
                    name: 'Professor Teste',
                },

                instrumento: {
                    id: 1,
                    name: 'Violão',
                },

                nivel: {
                    id: 1,
                    name: 'Iniciante',
                },
            })
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

            professor: {
                findUnique:
                    professorFindUniqueMock,
            },

            instrumento: {
                findUnique:
                    instrumentoFindUniqueMock,
            },

            nivel: {
                findUnique:
                    nivelFindUniqueMock,
            },

            usuarioInstrumento: {
                findFirst:
                    usuarioInstrumentoFindFirstMock,
            },

            professorInstrumento: {
                findFirst:
                    professorInstrumentoFindFirstMock,
            },

            disponibilidade: {
                findFirst:
                    disponibilidadeFindFirstMock,
            },

            agendamento: {
                findFirst:
                    agendamentoFindFirstMock,

                create:
                    agendamentoCreateMock,
            },
        },
    })
);

/**
 * Importar somente depois de
 * registrar o mock do Prisma.
 */
const {
    CreateAgendamentoService,
} = await import(
    '../../../services/Agendamento/CreateAgendamentoService'
);

/**
 * =====================================================
 * HELPERS
 * =====================================================
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

function dadosValidos(
    dataHora =
        criarDataValida()
) {
    return {
        usuarioId: 1,
        professorId: 2,
        instrumentoId: 1,
        nivelId: 1,
        dataHora,
    };
}

/**
 * =====================================================
 * TESTES
 * =====================================================
 */

describe(
    'CreateAgendamentoService',
    () => {
        beforeEach(() => {
            usuarioFindUniqueMock.mockReset();

            professorFindUniqueMock.mockReset();

            instrumentoFindUniqueMock.mockReset();

            nivelFindUniqueMock.mockReset();

            usuarioInstrumentoFindFirstMock.mockReset();

            professorInstrumentoFindFirstMock.mockReset();

            disponibilidadeFindFirstMock.mockReset();

            agendamentoFindFirstMock.mockReset();

            agendamentoCreateMock.mockReset();

            /**
             * ==========================================
             * COMPORTAMENTO PADRÃO
             * ==========================================
             */

            usuarioFindUniqueMock.mockResolvedValue({
                id: 1,
                name: 'João',
            });

            professorFindUniqueMock.mockResolvedValue({
                id: 2,
                name: 'Professor Teste',
            });

            instrumentoFindUniqueMock.mockResolvedValue({
                id: 1,
                name: 'Violão',
            });

            nivelFindUniqueMock.mockResolvedValue({
                id: 1,
                name: 'Iniciante',
            });

            usuarioInstrumentoFindFirstMock.mockResolvedValue({
                id: 1,
                usuarioId: 1,
                instrumentoId: 1,
                nivelId: 1,
            });

            professorInstrumentoFindFirstMock.mockResolvedValue({
                id: 1,
                professorId: 2,
                instrumentoId: 1,
                nivelId: 1,
            });

            /**
             * Por padrão o professor
             * disponibilizou o horário.
             */
            disponibilidadeFindFirstMock.mockResolvedValue({
                id: 1,
                professorId: 2,
                data: new Date(),
                horaInicio: new Date(),
                horaFim: new Date(),
            });

            /**
             * 1ª consulta:
             * conflito do professor.
             *
             * 2ª consulta:
             * conflito do aluno.
             */
            agendamentoFindFirstMock.mockResolvedValue(
                null
            );

            agendamentoCreateMock.mockImplementation(
                ({
                    data,
                }: {
                    data: any;
                }) =>
                    Promise.resolve({
                        id: 10,
                        ...data,

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
         * =====================================================
         * 1
         * =====================================================
         */
        test(
            'deve criar um agendamento válido',
            async () => {
                const service =
                    new CreateAgendamentoService();

                const dataHora =
                    criarDataValida();

                const resultado =
                    await service.execute(
                        dadosValidos(
                            dataHora
                        )
                    );

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
                    'AGENDADO'
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

                expect(
                    agendamentoCreateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 2
         * =====================================================
         */
        test(
            'deve rejeitar quando o usuário não existir',
            async () => {
                usuarioFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'Usuário não encontrado.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 3
         * =====================================================
         */
        test(
            'deve rejeitar quando o professor não existir',
            async () => {
                professorFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'Professor não encontrado.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 4
         * =====================================================
         */
        test(
            'deve rejeitar quando o instrumento não existir',
            async () => {
                instrumentoFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'Instrumento não encontrado.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 5
         * =====================================================
         */
        test(
            'deve rejeitar quando o nível não existir',
            async () => {
                nivelFindUniqueMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'Nível não encontrado.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 6
         * =====================================================
         */
        test(
            'deve rejeitar quando o usuário não tiver o instrumento e nível cadastrados',
            async () => {
                usuarioInstrumentoFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'O usuário não possui esse instrumento e nível cadastrados.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 7
         * =====================================================
         */
        test(
            'deve rejeitar quando o professor não lecionar o instrumento no nível informado',
            async () => {
                professorInstrumentoFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'O professor não leciona esse instrumento nesse nível.'
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 8
         * =====================================================
         */
        test(
            'deve rejeitar agendamento no passado',
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
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Não é possível agendar uma aula para uma data ou horário passado.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 9
         * =====================================================
         */
        test(
            'deve rejeitar agendamento para hoje',
            async () => {
                const dataHora =
                    new Date();

                /**
                 * Mantemos um horário futuro
                 * para atingir especificamente
                 * a regra que proíbe hoje.
                 */
                dataHora.setHours(
                    23,
                    59,
                    59,
                    999
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'A aula deve ser agendada entre amanhã e os próximos 14 dias.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 10
         * =====================================================
         */
        test(
            'deve rejeitar agendamento após o limite de 14 dias',
            async () => {
                const dataHora =
                    criarDataValida(
                        15,
                        9
                    );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'A aula deve ser agendada entre amanhã e os próximos 14 dias.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 11
         * =====================================================
         */
        test(
            'deve rejeitar horário não permitido',
            async () => {
                const dataHora =
                    criarDataValida(
                        2,
                        13
                    );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Horário não permitido para agendamento.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 12
         *
         * NOVO
         * =====================================================
         */
        test(
            'deve rejeitar quando o professor não tiver disponibilizado o horário',
            async () => {
                const dataHora =
                    criarDataValida();

                disponibilidadeFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'O professor não disponibilizou esse horário.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 13
         *
         * NOVO
         * =====================================================
         */
        test(
            'deve verificar a disponibilidade usando professorId e dataHora',
            async () => {
                const dataHora =
                    criarDataValida();

                const service =
                    new CreateAgendamentoService();

                await service.execute(
                    dadosValidos(
                        dataHora
                    )
                );

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledWith({
                    where: {
                        professorId:
                            2,

                        horaInicio:
                            dataHora,
                    },
                });
            }
        );

        /**
         * =====================================================
         * 14
         *
         * NOVO
         * =====================================================
         */
        test(
            'deve verificar a disponibilidade antes de consultar conflitos de agendamento',
            async () => {
                disponibilidadeFindFirstMock.mockResolvedValue(
                    null
                );

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos()
                    )
                ).rejects.toThrow(
                    'O professor não disponibilizou esse horário.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoFindFirstMock
                ).not.toHaveBeenCalled();

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 15
         * =====================================================
         */
        test(
            'deve rejeitar quando o professor já tiver um agendamento no mesmo horário',
            async () => {
                const dataHora =
                    criarDataValida();

                agendamentoFindFirstMock.mockResolvedValueOnce({
                    id: 50,
                    usuarioId: 99,
                    professorId: 2,
                    instrumentoId: 1,
                    nivelId: 1,
                    dataHora,
                    status:
                        'AGENDADO',
                });

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Esse horário já está agendado para esse professor.'
                );

                expect(
                    disponibilidadeFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoFindFirstMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 16
         * =====================================================
         */
        test(
            'deve rejeitar quando o aluno já tiver um agendamento no mesmo horário',
            async () => {
                const dataHora =
                    criarDataValida();

                agendamentoFindFirstMock
                    .mockResolvedValueOnce(
                        null
                    )
                    .mockResolvedValueOnce({
                        id: 60,
                        usuarioId: 1,
                        professorId: 5,
                        instrumentoId: 1,
                        nivelId: 1,
                        dataHora,
                        status:
                            'AGENDADO',
                    });

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Você já tem um agendamento nessa data e horário.'
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

                expect(
                    agendamentoCreateMock
                ).not.toHaveBeenCalled();
            }
        );

        /**
         * =====================================================
         * 17
         * =====================================================
         */
        test(
            'deve tratar conflito P2002 do aluno',
            async () => {
                const dataHora =
                    criarDataValida();

                agendamentoCreateMock.mockRejectedValueOnce({
                    code:
                        'P2002',

                    meta: {
                        target: [
                            'usuarioId',
                            'dataHora',
                        ],
                    },
                });

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Você já tem um agendamento nessa data e horário.'
                );

                expect(
                    agendamentoCreateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 18
         * =====================================================
         */
        test(
            'deve tratar conflito P2002 do professor',
            async () => {
                const dataHora =
                    criarDataValida();

                agendamentoCreateMock.mockRejectedValueOnce({
                    code:
                        'P2002',

                    meta: {
                        target: [
                            'professorId',
                            'dataHora',
                        ],
                    },
                });

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Esse horário já está agendado para esse professor.'
                );

                expect(
                    agendamentoCreateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );

        /**
         * =====================================================
         * 19
         * =====================================================
         */
        test(
            'deve retornar mensagem genérica para outro conflito P2002',
            async () => {
                const dataHora =
                    criarDataValida();

                agendamentoCreateMock.mockRejectedValueOnce({
                    code:
                        'P2002',

                    meta: {
                        target: [
                            'outroCampo',
                        ],
                    },
                });

                const service =
                    new CreateAgendamentoService();

                await expect(
                    service.execute(
                        dadosValidos(
                            dataHora
                        )
                    )
                ).rejects.toThrow(
                    'Esse horário não está mais disponível.'
                );

                expect(
                    agendamentoCreateMock
                ).toHaveBeenCalledTimes(
                    1
                );
            }
        );
    }
);