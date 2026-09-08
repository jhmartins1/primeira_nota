import { prisma } from '../../prisma/client';

import { HORARIOS_DISPONIVEIS } from '../../utils/horarios';

interface CreateAgendamentoDTO {
    usuarioId: number;
    professorId: number;
    instrumentoId: number;
    nivelId: number;
    dataHora: Date;
}

const DIAS_MAXIMOS_AGENDAMENTO = 14;

export class CreateAgendamentoService {
    async execute({
        usuarioId,
        professorId,
        instrumentoId,
        nivelId,
        dataHora,
    }: CreateAgendamentoDTO) {
        // 1. VERIFICAR USUÁRIO
        const usuario =
            await prisma.usuario.findUnique({
                where: {
                    id: usuarioId,
                },
            });

        if (!usuario) {
            throw new Error(
                'Usuário não encontrado.'
            );
        }

        // 2. VERIFICAR PROFESSOR
        const professor =
            await prisma.professor.findUnique({
                where: {
                    id: professorId,
                },
            });

        if (!professor) {
            throw new Error(
                'Professor não encontrado.'
            );
        }

        // 3. VERIFICAR INSTRUMENTO
        const instrumento =
            await prisma.instrumento.findUnique({
                where: {
                    id: instrumentoId,
                },
            });

        if (!instrumento) {
            throw new Error(
                'Instrumento não encontrado.'
            );
        }

        // 4. VERIFICAR NÍVEL
        const nivel =
            await prisma.nivel.findUnique({
                where: {
                    id: nivelId,
                },
            });

        if (!nivel) {
            throw new Error(
                'Nível não encontrado.'
            );
        }

        // 5. VERIFICAR SE O USUÁRIO POSSUI
        // O INSTRUMENTO E NÍVEL CADASTRADOS
        const usuarioInstrumento =
            await prisma.usuarioInstrumento.findFirst({
                where: {
                    usuarioId,
                    instrumentoId,
                    nivelId,
                },
            });

        if (!usuarioInstrumento) {
            throw new Error(
                'O usuário não possui esse instrumento e nível cadastrados.'
            );
        }

        // 6. VERIFICAR SE O PROFESSOR
        // LECIONA O INSTRUMENTO E NÍVEL
        const professorInstrumento =
            await prisma.professorInstrumento.findFirst({
                where: {
                    professorId,
                    instrumentoId,
                    nivelId,
                },
            });

        if (!professorInstrumento) {
            throw new Error(
                'O professor não leciona esse instrumento nesse nível.'
            );
        }

        // 7. VERIFICAR SE A DATA/HORA NÃO PASSOU
        const agora =
            new Date();

        if (dataHora <= agora) {
            throw new Error(
                'Não é possível agendar uma aula para uma data ou horário passado.'
            );
        }

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

        // 8. VERIFICAR LIMITE DE 14 DIAS
        if (
            dataComparar < amanha ||
            dataComparar > limite
        ) {
            throw new Error(
                `A aula deve ser agendada entre amanhã e os próximos ${DIAS_MAXIMOS_AGENDAMENTO} dias.`
            );
        }

        // 9. VERIFICAR HORÁRIO PERMITIDO
        const horas =
            dataHora.getHours();

        const minutos =
            dataHora.getMinutes();

        const horario =
            `${String(horas).padStart(
                2,
                '0'
            )}:${String(minutos).padStart(
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

        // 10. VERIFICAR SE O PROFESSOR
        // REALMENTE DISPONIBILIZOU O HORÁRIO
        const disponibilidade =
            await prisma.disponibilidade.findFirst({
                where: {
                    professorId,
                    horaInicio: dataHora,
                },
            });

        if (!disponibilidade) {
            throw new Error(
                'O professor não disponibilizou esse horário.'
            );
        }

        // 11. VERIFICAR CONFLITO DO PROFESSOR
        const conflitoProfessor =
            await prisma.agendamento.findFirst({
                where: {
                    professorId,
                    dataHora,
                    status: 'AGENDADO',
                },
            });

        if (conflitoProfessor) {
            throw new Error(
                'Esse horário já está agendado para esse professor.'
            );
        }

        // 12. VERIFICAR CONFLITO DO ALUNO
        const conflitoUsuario =
            await prisma.agendamento.findFirst({
                where: {
                    usuarioId,
                    dataHora,
                    status: 'AGENDADO',
                },
            });

        if (conflitoUsuario) {
            throw new Error(
                'Você já tem um agendamento nessa data e horário.'
            );
        }

        // 13. CRIAR AGENDAMENTO
        try {
            return await prisma.agendamento.create({
                data: {
                    usuarioId,
                    professorId,
                    instrumentoId,
                    nivelId,
                    dataHora,
                    status: 'AGENDADO',
                },

                include: {
                    professor: true,
                    instrumento: true,
                    nivel: true,
                },
            });
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
                    Array.isArray(target) &&
                    target.includes(
                        'usuarioId'
                    ) &&
                    target.includes(
                        'dataHora'
                    )
                ) {
                    throw new Error(
                        'Você já tem um agendamento nessa data e horário.'
                    );
                }

                // CONFLITO DO PROFESSOR
                if (
                    Array.isArray(target) &&
                    target.includes(
                        'professorId'
                    ) &&
                    target.includes(
                        'dataHora'
                    )
                ) {
                    throw new Error(
                        'Esse horário já está agendado para esse professor.'
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