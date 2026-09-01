import { prisma } from "../../prisma/client";

export class GetAllProfessorService {
    async execute() {
        const professors = await prisma.professor.findMany({
            orderBy: {
                name: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                instrumentos: {
                    select: {
                        instrumento: { select: { id: true, name: true } },
                        nivel: { select: { id: true, name: true } },
                    }
                }
            }
        });
        return professors;
    }
}