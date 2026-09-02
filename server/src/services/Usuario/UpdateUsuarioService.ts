import { prisma } from '../../prisma/client'
import { isTelefoneValido } from '../../utils/validators';

interface UpdateUsuarioRequest {
    id: number;
    phone?: string;
}

export class UpdateUsuarioService {
    async execute({ id, phone }: UpdateUsuarioRequest) {
        const usuarioExists = await prisma.usuario.findUnique({ where: { id } });

        if (!usuarioExists) {
            return new Error('Usuário não encontrado');
        }

        if (phone !== undefined) {
            if (!isTelefoneValido(phone)) {
                return new Error('Telefone inválido');
            }
        }

        try {
            const usuario = await prisma.usuario.update({
                where: { id },
                data: {
                    ...(phone !== undefined && { phone: phone.replace(/\D/g, '') }),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                }
            });

            return usuario;
        } catch (error) {
            console.error('Error updating usuario:', error);
            return new Error('Não foi possível atualizar o usuário');
        }
    }
}