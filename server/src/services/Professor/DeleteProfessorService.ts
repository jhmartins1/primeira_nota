import { prisma } from '../../prisma/client'

export class DeleteProfessorService {
    async execute(id: number) {
        const professorExists = await prisma.professor.findUnique({
            where: {
                id,
            },
        });
        if (!professorExists) {
            throw new Error('Professor not found');
        }
        const professor = await prisma.professor.delete({
            where: {
                id,
            },
        })
        return professor;
    }
}