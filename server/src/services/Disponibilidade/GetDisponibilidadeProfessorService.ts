import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface GetDisponibilidadeProfessorDTO {
    professorId: number;
}

export class GetDisponibilidadeProfessorService {
    async execute({
        professorId,
    }: GetDisponibilidadeProfessorDTO) {
        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        const agora =
            new Date();

        const disponibilidades =
            await prisma.disponibilidade.findMany(
                {
                    where: {
                        professorId,

                        horaInicio: {
                            gte:
                                agora,
                        },
                    },

                    orderBy: {
                        horaInicio:
                            'asc',
                    },
                }
            );

        return disponibilidades;
    }
}