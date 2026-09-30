import { prisma } from '../../prisma/client';

interface RemarcarAgendamentoProfessorDTO {
    professorId: number;
    agendamentoId: number;
    data: string;
    horario: string;
}

const TIME_ZONE =
    'America/Sao_Paulo';

const DIAS_MAXIMOS_AGENDAMENTO =
    14;

export class RemarcarAgendamentoProfessorService {
    async execute({
        professorId,
        agendamentoId,
        data,
        horario,
    }: RemarcarAgendamentoProfessorDTO) {
        // ----------------------------------------------------
        // 1. AGENDAMENTO
        // ----------------------------------------------------

        const agendamento =
            await prisma.agendamento.findUnique({
                where: {
                    id: agendamentoId,
                },
            });

        if (!agendamento) {
            throw new Error(
                'Agendamento não encontrado.'
            );
        }

        // ----------------------------------------------------
        // 2. GARANTIR QUE A AULA PERTENCE AO PROFESSOR
        // ----------------------------------------------------

        if (
            agendamento.professorId !==
            professorId
        ) {
            throw new Error(
                'Você não tem permissão para remarcar esta aula.'
            );
        }

        // ----------------------------------------------------
        // 3. STATUS
        // ----------------------------------------------------

        if (
            agendamento.status !==
            'AGENDADO'
        ) {
            throw new Error(
                'Esta aula não pode mais ser remarcada.'
            );
        }

        // ----------------------------------------------------
        // 4. A AULA ORIGINAL AINDA PRECISA ESTAR NO FUTURO
        // ----------------------------------------------------

        const agora =
            new Date();

        if (
            agendamento.dataHora <=
            agora
        ) {
            throw new Error(
                'Não é possível remarcar uma aula que já passou.'
            );
        }

        // ----------------------------------------------------
        // 5. VALIDAR FORMATO DA DATA
        // ----------------------------------------------------

        if (
            !ehDataValida(data)
        ) {
            throw new Error(
                'Data inválida.'
            );
        }

        // ----------------------------------------------------
        // 6. VALIDAR FORMATO DO HORÁRIO
        //
        // Não existe mais uma lista fixa.
        //
        // Exemplos válidos:
        // 06:40
        // 09:00
        // 10:40
        // 14:30
        // 20:00
        // 23:59
        // ----------------------------------------------------

        if (
            !ehHorarioValido(
                horario
            )
        ) {
            throw new Error(
                'Horário inválido. Use o formato HH:mm.'
            );
        }

        // ----------------------------------------------------
        // 7. CONVERTER DATA/HORA DE SÃO PAULO PARA DATE
        // ----------------------------------------------------

        const dataHora =
            criarDataSaoPaulo(
                data,
                horario
            );

        if (
            Number.isNaN(
                dataHora.getTime()
            )
        ) {
            throw new Error(
                'Data ou horário inválidos.'
            );
        }

        // ----------------------------------------------------
        // 8. GARANTIR QUE O JS NÃO NORMALIZOU UMA DATA
        // INVÁLIDA
        //
        // Exemplo:
        //
        // 2026-02-31
        //
        // não pode virar automaticamente uma data de março.
        // ----------------------------------------------------

        if (
            formatarDataSaoPaulo(
                dataHora
            ) !== data ||
            formatarHoraSaoPaulo(
                dataHora
            ) !== horario
        ) {
            throw new Error(
                'Data ou horário inválidos.'
            );
        }

        // ----------------------------------------------------
        // 9. NOVA DATA/HORA PRECISA ESTAR NO FUTURO
        // ----------------------------------------------------

        if (
            dataHora <=
            agora
        ) {
            throw new Error(
                'Não é possível remarcar para uma data ou horário passado.'
            );
        }

        // ----------------------------------------------------
        // 10. JANELA DE 14 DIAS
        //
        // Amanhã até hoje + 14 dias.
        // Tudo baseado na data de São Paulo.
        // ----------------------------------------------------

        const hoje =
            formatarDataSaoPaulo(
                agora
            );

        const amanha =
            adicionarDias(
                hoje,
                1
            );

        const limite =
            adicionarDias(
                hoje,
                DIAS_MAXIMOS_AGENDAMENTO
            );

        if (
            data < amanha ||
            data > limite
        ) {
            throw new Error(
                `A aula deve ser remarcada entre amanhã e os próximos ${DIAS_MAXIMOS_AGENDAMENTO} dias.`
            );
        }

        // ----------------------------------------------------
        // 11. NÃO PODE SER O MESMO HORÁRIO ATUAL
        // ----------------------------------------------------

        if (
            agendamento.dataHora.getTime() ===
            dataHora.getTime()
        ) {
            throw new Error(
                'Escolha uma data ou horário diferente do agendamento atual.'
            );
        }

        // ----------------------------------------------------
        // 12. DISPONIBILIDADE REAL DO PROFESSOR
        //
        // ESTA É A FONTE DA VERDADE.
        //
        // Não importa se é:
        //
        // 09:00
        // 10:40
        // 12:25
        // 20:00
        //
        // Se existir uma disponibilidade exatamente nesse
        // horário, ele pode ser utilizado.
        // ----------------------------------------------------

        const disponibilidade =
            await prisma.disponibilidade.findFirst({
                where: {
                    professorId,

                    horaInicio:
                        dataHora,
                },
            });

        if (!disponibilidade) {
            throw new Error(
                'Você não disponibilizou esse horário.'
            );
        }

        // ----------------------------------------------------
        // 13. CONFLITO DO PROFESSOR
        //
        // Consideramos conflito somente outro agendamento
        // começando exatamente no mesmo horário.
        //
        // Não existe bloqueio automático de 30 ou 60 minutos.
        // ----------------------------------------------------

        const conflitoProfessor =
            await prisma.agendamento.findFirst({
                where: {
                    id: {
                        not:
                            agendamentoId,
                    },

                    professorId,

                    dataHora,

                    status:
                        'AGENDADO',
                },
            });

        if (conflitoProfessor) {
            throw new Error(
                'Você já possui outra aula agendada nessa data e horário.'
            );
        }

        // ----------------------------------------------------
        // 14. CONFLITO DO ALUNO
        //
        // Mesmo que o professor esteja livre, o aluno não
        // pode ter duas aulas começando exatamente no mesmo
        // horário.
        // ----------------------------------------------------

        const conflitoAluno =
            await prisma.agendamento.findFirst({
                where: {
                    id: {
                        not:
                            agendamentoId,
                    },

                    usuarioId:
                        agendamento.usuarioId,

                    dataHora,

                    status:
                        'AGENDADO',
                },
            });

        if (conflitoAluno) {
            throw new Error(
                'O aluno já possui outra aula agendada nessa data e horário.'
            );
        }

        // ----------------------------------------------------
        // 15. ALTERAR SOMENTE DATA/HORA
        //
        // O P2002 continua sendo tratado porque pode ocorrer
        // condição de corrida entre duas requisições.
        // ----------------------------------------------------

        try {
            const agendamentoRemarcado =
                await prisma.agendamento.update({
                    where: {
                        id:
                            agendamentoId,
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
                });

            return agendamentoRemarcado;
        } catch (error: any) {
            if (
                error?.code ===
                'P2002'
            ) {
                const target =
                    error?.meta?.target;

                // CONFLITO DO ALUNO
                if (
                    Array.isArray(
                        target
                    ) &&
                    target.includes(
                        'usuarioId'
                    ) &&
                    target.includes(
                        'dataHora'
                    )
                ) {
                    throw new Error(
                        'O aluno já possui outra aula agendada nessa data e horário.'
                    );
                }

                // CONFLITO DO PROFESSOR
                if (
                    Array.isArray(
                        target
                    ) &&
                    target.includes(
                        'professorId'
                    ) &&
                    target.includes(
                        'dataHora'
                    )
                ) {
                    throw new Error(
                        'Você já possui outra aula agendada nessa data e horário.'
                    );
                }

                throw new Error(
                    'Esse horário não está mais disponível.'
                );
            }

            throw error;
        }
    }
}

// ============================================================
// HELPERS
// ============================================================

// ------------------------------------------------------------
// VALIDAR HORÁRIO HH:mm
// ------------------------------------------------------------

function ehHorarioValido(
    horario: string
): boolean {
    if (
        typeof horario !==
        'string'
    ) {
        return false;
    }

    if (
        !/^\d{2}:\d{2}$/.test(
            horario
        )
    ) {
        return false;
    }

    const partes =
        horario.split(':');

    const horaTexto =
        partes[0];

    const minutoTexto =
        partes[1];

    if (
        horaTexto === undefined ||
        minutoTexto === undefined
    ) {
        return false;
    }

    const hora =
        Number(
            horaTexto
        );

    const minuto =
        Number(
            minutoTexto
        );

    return (
        Number.isInteger(
            hora
        ) &&
        Number.isInteger(
            minuto
        ) &&
        hora >= 0 &&
        hora <= 23 &&
        minuto >= 0 &&
        minuto <= 59
    );
}

// ------------------------------------------------------------
// VALIDAR DATA YYYY-MM-DD
// ------------------------------------------------------------

function ehDataValida(
    data: string
): boolean {
    if (
        typeof data !==
        'string'
    ) {
        return false;
    }

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            data
        )
    ) {
        return false;
    }

    const partes =
        data.split('-');

    const anoTexto =
        partes[0];

    const mesTexto =
        partes[1];

    const diaTexto =
        partes[2];

    if (
        !anoTexto ||
        !mesTexto ||
        !diaTexto
    ) {
        return false;
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
        return false;
    }

    const teste =
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

    return (
        teste.getUTCFullYear() ===
        ano &&
        teste.getUTCMonth() ===
        mes - 1 &&
        teste.getUTCDate() ===
        dia
    );
}

// ------------------------------------------------------------
// CRIAR DATE CONSIDERANDO HORÁRIO DE SÃO PAULO
// ------------------------------------------------------------

function criarDataSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

// ------------------------------------------------------------
// FORMATAR DATA NO FUSO DE SÃO PAULO
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// FORMATAR HORA NO FUSO DE SÃO PAULO
// ------------------------------------------------------------

function formatarHoraSaoPaulo(
    data: Date
): string {
    return new Intl.DateTimeFormat(
        'en-GB',
        {
            timeZone:
                TIME_ZONE,

            hour:
                '2-digit',

            minute:
                '2-digit',

            hour12:
                false,
        }
    ).format(
        data
    );
}

// ------------------------------------------------------------
// ADICIONAR DIAS
// ------------------------------------------------------------

function adicionarDias(
    data: string,
    quantidade: number
): string {
    const [
        anoTexto,
        mesTexto,
        diaTexto,
    ] =
        data.split('-');

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