
import { prisma } from '../../prisma/client';

interface CancelarAgendamentoDTO {
    usuarioId: number;
    agendamentoId: number;
}

export class CancelarAgendamentoService {
    async execute({
        usuarioId,
        agendamentoId,
    }: CancelarAgendamentoDTO) {
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

        /*
         * Segurança:
         *
         * O usuário só pode cancelar uma aula
         * que pertence à própria conta.
         */
        if (agendamento.usuarioId !== usuarioId) {
            throw new Error(
                'Você não tem permissão para cancelar esta aula.'
            );
        }

        /*
         * Não permite cancelar novamente
         * uma aula já cancelada.
         */
        if (agendamento.status !== 'AGENDADO') {
            throw new Error(
                'Esta aula não está mais agendada.'
            );
        }

        /*
         * Não permite cancelar uma aula que
         * já passou.
         */
        if (agendamento.dataHora <= new Date()) {
            throw new Error(
                'Não é possível cancelar uma aula que já passou.'
            );
        }

        /*
         * Mantemos o registro no banco e apenas
         * alteramos seu status.
         *
         * Isso preserva o histórico da aula.
         */
        const agendamentoCancelado =
            await prisma.agendamento.update({
                where: {
                    id: agendamentoId,
                },
                data: {
                    status: 'CANCELADO',
                },
                include: {
                    professor: true,
                    instrumento: true,
                    nivel: true,
                },
            });

        return agendamentoCancelado;
    }
}

