import { createClerkClient } from '@clerk/backend';
import { prisma } from '../../prisma/client';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export class VincularContaProfessorService {
    async execute(clerkId: string) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        const email =
            clerkUser.primaryEmailAddress?.emailAddress;

        if (!email) {
            throw new Error(
                'Não foi possível obter o e-mail da conta Clerk.'
            );
        }

        const professor = await prisma.professor.findUnique({
            where: { email },
        });

        if (!professor) {
            throw new Error(
                'Nenhum cadastro de professor encontrado para este e-mail.'
            );
        }

        if (professor.clerkId && professor.clerkId !== clerkId) {
            throw new Error(
                'Este cadastro já está vinculado a outra conta.'
            );
        }

        if (professor.clerkId === clerkId) {
            return professor;
        }

        const atualizado = await prisma.professor.update({
            where: { id: professor.id },
            data: { clerkId },
        });

        return atualizado;
    }
}