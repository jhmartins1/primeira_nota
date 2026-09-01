import { prisma } from '../../prisma/client'

export class GetOneProfessorService {
    async execute(id: number) {
        const professor = await prisma.professor.findUnique({
            where: { id },
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

        if (!professor) {
            throw new Error('Professor not found');
        }

        return professor;
    }
}