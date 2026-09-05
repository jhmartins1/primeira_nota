import { prisma } from '../../prisma/client';
import { HORARIOS_DISPONIVEIS } from '../../utils/horarios';

interface RemarcarAgendamentoDTO {
    usuarioId: number;
    agendamentoId: number;
    dataHora: Date;
}

const DIAS_MAXIMOS_AGENDAMENTO = 14;

export class RemarcarAgendamentoService {
    async execute({
        usuarioId,
        agendamentoId,
        dataHora,
    }: RemarcarAgendamentoDTO) {
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

        if (
            agendamento.usuarioId !== usuarioId
        ) {
            throw new Error(
                'Você não tem permissão para remarcar esta aula.'
            );
        }

        if (
            agendamento.status !==
            'AGENDADO'
        ) {
            throw new Error(
                'Esta aula não pode mais ser remarcada.'
            );
        }

        if (
            agendamento.dataHora <=
            new Date()
        ) {
            throw new Error(
                'Não é possível remarcar uma aula que já passou.'
            );
        }

        const agora = new Date();

        if (dataHora <= agora) {
            throw new Error(
                'Não é possível remarcar para uma data ou horário passado.'
            );
        }

        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const amanha =
            new Date(hoje);

        amanha.setDate(
            amanha.getDate() + 1
        );

        const limite =
            new Date(hoje);

        limite.setDate(
            limite.getDate() +
            DIAS_MAXIMOS_AGENDAMENTO
        );

        const dataComparar =
            new Date(dataHora);

        dataComparar.setHours(
            0,
            0,
            0,
            0
        );

        if (
            dataComparar < amanha ||
            dataComparar > limite
        ) {
            throw new Error(
                `A aula deve ser remarcada entre amanhã e os próximos ${DIAS_MAXIMOS_AGENDAMENTO} dias.`
            );
        }

        const horas =
            dataHora.getHours();

        const minutos =
            dataHora.getMinutes();

        const horario =
            `${String(horas).padStart(
                2,
                '0'
            )}:${String(
                minutos
            ).padStart(
                2,
                '0'
            )}`;

        if (
            !HORARIOS_DISPONIVEIS.includes(
                horario
            )
        ) {
            throw new Error(
                'Horário não permitido para agendamento.'
            );
        }

        if (
            agendamento.dataHora.getTime() ===
            dataHora.getTime()
        ) {
            throw new Error(
                'Escolha uma data ou horário diferente do agendamento atual.'
            );
        }

        const disponibilidade =
            await prisma.disponibilidade.findFirst({
                where: {
                    professorId:
                        agendamento.professorId,

                    horaInicio:
                        dataHora,
                },
            });

        if (!disponibilidade) {
            throw new Error(
                'O professor não disponibilizou esse horário.'
            );
        }
        const conflitoProfessor =
            await prisma.agendamento.findFirst({
                where: {
                    id: {
                        not: agendamentoId,
                    },

                    professorId:
                        agendamento.professorId,

                    dataHora,

                    status: 'AGENDADO',
                },
            });

        if (conflitoProfessor) {
            throw new Error(
                'Esse horário não está mais disponível para esse professor.'
            );
        }
        const conflitoAluno =
            await prisma.agendamento.findFirst({
                where: {
                    id: {
                        not: agendamentoId,
                    },

                    usuarioId,

                    dataHora,

                    status: 'AGENDADO',
                },
            });

        if (conflitoAluno) {
            throw new Error(
                'Você já possui outra aula agendada nessa data e horário.'
            );
        }
        try {
            const agendamentoRemarcado =
                await prisma.agendamento.update({
                    where: {
                        id: agendamentoId,
                    },

                    data: {
                        dataHora,
                    },

                    include: {
                        professor: true,
                        instrumento: true,
                        nivel: true,
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
                        'Você já possui outra aula nessa data e horário.'
                    );
                }

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
                        'Esse horário não está mais disponível para esse professor.'
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