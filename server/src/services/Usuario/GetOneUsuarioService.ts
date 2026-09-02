import { prisma } from '../../prisma/client'

export class GetOneUsuarioService {
    async execute(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
            }
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        return {
            ...usuario,
            profileComplete: !!usuario.phone,
        };
    }
}