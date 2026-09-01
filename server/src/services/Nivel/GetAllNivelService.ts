import { prisma } from '../../prisma/client'

export class GetAllNivelService {
    async execute() {
        const niveis = await prisma.nivel.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return niveis;
    }
}