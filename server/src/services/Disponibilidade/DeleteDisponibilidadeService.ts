import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface DeleteDisponibilidadeDTO {
    professorId: number;
    disponibilidadeId: number;
}

export class DeleteDisponibilidadeService {
    async execute({
        professorId,
        disponibilidadeId,
    }: DeleteDisponibilidadeDTO) {
        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        if (
            !Number.isInteger(
                disponibilidadeId
            ) ||
            disponibilidadeId <= 0
        ) {
            throw new AppError(
                'Disponibilidade inválida.',
                400
            );
        }

        const disponibilidade =
            await prisma.disponibilidade.findUnique(
                {
                    where: {
                        id:
                            disponibilidadeId,
                    },
                }
            );

        if (
            !disponibilidade ||
            disponibilidade.professorId !==
            professorId
        ) {
            throw new AppError(
                'Disponibilidade não encontrada.',
                404
            );
        }

        const agendamentoConflitante =
            await prisma.agendamento.findFirst(
                {
                    where: {
                        professorId,

                        status:
                            'AGENDADO',

                        dataHora: {
                            gte:
                                disponibilidade.horaInicio,

                            lt:
                                disponibilidade.horaFim,
                        },
                    },
                }
            );

        if (
            agendamentoConflitante
        ) {
            throw new AppError(
                'Já existe uma aula agendada nesse horário. Cancele a aula antes de remover este horário.',
                409
            );
        }

        await prisma.disponibilidade.delete(
            {
                where: {
                    id:
                        disponibilidadeId,
                },
            }
        );

        return {
            message:
                'Disponibilidade removida com sucesso.',
        };
    }
}