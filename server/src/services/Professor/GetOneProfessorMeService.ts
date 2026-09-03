import { prisma } from '../../prisma/client';

export class GetOneProfessorMeService {
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
                    },
                },
            },
        });

        if (!professor) {
            throw new Error('Professor não encontrado');
        }

        return {
            id: professor.id,
            name: professor.name,
            email: professor.email,
            phone: professor.phone,
            image: professor.image,

            instrumentos: professor.instrumentos.map((item) => ({
                instrumento: item.instrumento.name,
                nivel: item.nivel.name,
            })),
        };
    }
}