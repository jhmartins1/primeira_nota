import { prisma } from '../../prisma/client';

interface CancelarAgendamentoDTO {
    usuarioId?: number;
    professorId?: number;
    agendamentoId: number;
}

export class CancelarAgendamentoService {
    async execute({
        usuarioId,
        professorId,
        agendamentoId,
    }: CancelarAgendamentoDTO) {
        // ----------------------------------------------------
        // BUSCAR AGENDAMENTO
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
        // SEGURANÇA
        // ----------------------------------------------------
        // O aluno só pode cancelar uma aula dele.
        //
        // O professor só pode cancelar uma aula
        // que esteja vinculada a ele.
        // ----------------------------------------------------

        const pertenceAoUsuario =
            usuarioId !== undefined &&
            agendamento.usuarioId === usuarioId;

        const pertenceAoProfessor =
            professorId !== undefined &&
            agendamento.professorId === professorId;

        if (
            !pertenceAoUsuario &&
            !pertenceAoProfessor
        ) {
            throw new Error(
                'Você não tem permissão para cancelar esta aula.'
            );
        }

        // ----------------------------------------------------
        // VERIFICAR STATUS
        // ----------------------------------------------------

        if (agendamento.status !== 'AGENDADO') {
            throw new Error(
                'Esta aula não está mais agendada.'
            );
        }

        // ----------------------------------------------------
        // VERIFICAR DATA
        // ----------------------------------------------------

        if (agendamento.dataHora <= new Date()) {
            throw new Error(
                'Não é possível cancelar uma aula que já passou.'
            );
        }

        // ----------------------------------------------------
        // CANCELAR
        // ----------------------------------------------------
        // Não deletamos o registro.
        //
        // Apenas alteramos o status para CANCELADO,
        // preservando o histórico da aula.
        // ----------------------------------------------------

        const agendamentoCancelado =
            await prisma.agendamento.update({
                where: {
                    id: agendamentoId,
                },
                data: {
                    status: 'CANCELADO',
                },
                include: {
                    usuario: true,
                    professor: true,
                    instrumento: true,
                    nivel: true,
                },
            });

        return agendamentoCancelado;
    }
}