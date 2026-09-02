import { prisma } from '../../prisma/client';

interface GetAgendamentosDTO {
    usuarioId: number;
}

export class GetAgendamentosService {
    async execute({
        usuarioId,
    }: GetAgendamentosDTO) {
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

        return prisma.agendamento.findMany({
            where: {
                usuarioId,

                /*
                 * A Home mostra somente aulas
                 * que ainda estão agendadas.
                 */
                status: 'AGENDADO',

                /*
                 * Não mostra aulas que já passaram.
                 */
                dataHora: {
                    gte: new Date(),
                },
            },

            include: {
                professor: true,
                instrumento: true,
                nivel: true,
            },

            orderBy: {
                dataHora: 'asc',
            },
        });
    }
}

