import { prisma } from '../../prisma/client';

export class GetAgendamentosProfessorService {
    async execute(professorId: number) {
        return prisma.agendamento.findMany({
            where: { professorId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        phone: true,
                        logradouro: true,
                        numero: true,
                        complemento: true,
                        bairro: true,
                        cidade: true,
                        uf: true,
                    },
                },
                instrumento: { select: { id: true, name: true } },
                nivel: { select: { id: true, name: true } },
            },
            orderBy: { dataHora: 'asc' },
        });
    }
}