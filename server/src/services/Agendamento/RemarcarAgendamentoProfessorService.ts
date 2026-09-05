import { prisma } from '../../prisma/client';
import { HORARIOS_DISPONIVEIS } from '../../utils/horarios';

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
        // 5. HORÁRIO PERMITIDO
        //
        // Validamos diretamente a string recebida.
        // Não usamos dataHora.getHours(), pois o servidor
        // pode estar rodando em UTC.
        // ----------------------------------------------------

        if (
            !HORARIOS_DISPONIVEIS.includes(
                horario
            )
        ) {
            throw new Error(
                'Horário não permitido para agendamento.'
            );
        }

        // ----------------------------------------------------
        // 6. CONVERTER DATA/HORA DE SÃO PAULO PARA DATE
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
        // 7. EVITAR DATAS INVÁLIDAS QUE O JS NORMALIZA
        //
        // Ex:
        // 2026-02-31
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
        // 8. NOVA DATA PRECISA ESTAR NO FUTURO
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
        // 9. JANELA DE 14 DIAS
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
        // 10. NÃO PODE SER O MESMO HORÁRIO ATUAL
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
        // 11. DISPONIBILIDADE REAL DO PROFESSOR
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
        // 12. CONFLITO DO PROFESSOR
        //
        // Ignoramos o próprio agendamento que está sendo
        // remarcado.
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
        // 13. CONFLITO DO ALUNO
        //
        // Mesmo que o professor esteja livre, o aluno pode
        // ter outra aula com outro professor nesse horário.
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
        // 14. ALTERAR SOMENTE DATA/HORA
        // ----------------------------------------------------

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
    }
}

// ============================================================
// HELPERS
// ============================================================

function criarDataSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}

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

function adicionarDias(
    data: string,
    quantidade: number
): string {
    const [
        anoTexto,
        mesTexto,
        diaTexto,
    ] =
        data.split(
            '-'
        );

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