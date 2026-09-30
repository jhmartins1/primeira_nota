import { prisma } from '../../prisma/client';

interface GetAgendamentosDTO {
    usuarioId: number;
}

export class GetAgendamentosService {
    async execute({
        usuarioId,
    }: GetAgendamentosDTO) {
        // ----------------------------------------------------
        // 1. VERIFICAR USUÁRIO
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // 2. BUSCAR AULAS FUTURAS
        //
        // Não existe nenhuma restrição de horário aqui.
        //
        // Portanto uma aula pode começar:
        // 09:00
        // 10:40
        // 14:30
        // 20:00
        // etc.
        // ----------------------------------------------------

        return prisma.agendamento.findMany({
            where: {
                usuarioId,

                // Somente aulas ainda agendadas.
                status: 'AGENDADO',

                // Não mostrar aulas que já passaram.
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