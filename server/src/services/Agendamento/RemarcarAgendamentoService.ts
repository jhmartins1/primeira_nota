import { prisma } from '../../prisma/client';

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
        // 1. BUSCAR AGENDAMENTO
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

        // 2. VERIFICAR SE O AGENDAMENTO
        // PERTENCE AO USUÁRIO
        if (
            agendamento.usuarioId !==
            usuarioId
        ) {
            throw new Error(
                'Você não tem permissão para remarcar esta aula.'
            );
        }

        // 3. VERIFICAR STATUS
        if (
            agendamento.status !==
            'AGENDADO'
        ) {
            throw new Error(
                'Esta aula não pode mais ser remarcada.'
            );
        }

        // 4. A AULA ORIGINAL PRECISA
        // AINDA ESTAR NO FUTURO
        if (
            agendamento.dataHora <=
            new Date()
        ) {
            throw new Error(
                'Não é possível remarcar uma aula que já passou.'
            );
        }

        // 5. NOVA DATA/HORA PRECISA
        // ESTAR NO FUTURO
        const agora =
            new Date();

        if (dataHora <= agora) {
            throw new Error(
                'Não é possível remarcar para uma data ou horário passado.'
            );
        }

        // 6. CALCULAR JANELA DE AGENDAMENTO
        const hoje =
            new Date();

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

        // 7. VERIFICAR LIMITE DE 14 DIAS
        if (
            dataComparar < amanha ||
            dataComparar > limite
        ) {
            throw new Error(
                `A aula deve ser remarcada entre amanhã e os próximos ${DIAS_MAXIMOS_AGENDAMENTO} dias.`
            );
        }

        // 8. NÃO PERMITIR REMARCAR
        // PARA O MESMO HORÁRIO
        if (
            agendamento.dataHora.getTime() ===
            dataHora.getTime()
        ) {
            throw new Error(
                'Escolha uma data ou horário diferente do agendamento atual.'
            );
        }

        // 9. VERIFICAR DISPONIBILIDADE REAL
        // DO PROFESSOR
        //
        // Não existe mais uma lista fixa de horários.
        //
        // Se o professor disponibilizou:
        // 06:40
        // 10:40
        // 14:30
        // 20:00
        //
        // qualquer um deles pode ser utilizado.
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

        // 10. VERIFICAR CONFLITO DO PROFESSOR
        //
        // Apenas o mesmo horário de início
        // é considerado conflito.
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

        // 11. VERIFICAR CONFLITO DO ALUNO
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

        // 12. ATUALIZAR AGENDAMENTO
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
            // PROTEÇÃO CONTRA CONCORRÊNCIA
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
                        'Você já possui outra aula nessa data e horário.'
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