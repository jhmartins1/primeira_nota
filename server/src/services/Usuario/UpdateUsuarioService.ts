import { createClerkClient } from '@clerk/backend';

import { prisma } from '../../prisma/client';

import { isTelefoneValido } from '../../utils/validators';

interface UpdateUsuarioRequest {
    clerkId: string;
    phone?: string;
}

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
});

export class UpdateUsuarioService {
    async execute({
        clerkId,
        phone,
    }: UpdateUsuarioRequest) {
        // VALIDAR TELEFONE
        if (phone !== undefined) {
            if (!isTelefoneValido(phone)) {
                return new Error('Telefone inválido');
            }
        }

        try {
            // VERIFICAR SE USUÁRIO JÁ EXISTE
            const usuarioExists =
                await prisma.usuario.findUnique({
                    where: {
                        clerkId,
                    },
                });

            // USUÁRIO JÁ EXISTE
            if (usuarioExists) {
                const usuario =
                    await prisma.usuario.update({
                        where: {
                            id: usuarioExists.id,
                        },
                        data: {
                            ...(phone !== undefined && {
                                phone: phone.replace(/\D/g, ''),
                            }),
                        },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            image: true,
                        },
                    });

                return usuario;
            }

            // PRIMEIRO ACESSO
            const clerkUser =
                await clerkClient.users.getUser(clerkId);

            const name =
                clerkUser.fullName ||
                clerkUser.firstName ||
                clerkUser.username ||
                'Usuário';

            const email =
                clerkUser.primaryEmailAddress?.emailAddress;

            if (!email) {
                return new Error(
                    'Não foi possível identificar o e-mail da conta.'
                );
            }

            const image = clerkUser.imageUrl;
            // CRIAR USUÁRIO
            const usuario =
                await prisma.usuario.create({
                    data: {
                        clerkId,
                        name,
                        email,
                        phone:
                            phone !== undefined
                                ? phone.replace(/\D/g, '')
                                : null,
                        image,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        image: true,
                    },
                });

            return usuario;
        } catch (error) {
            console.error(
                'Error creating/updating usuario:',
                error
            );

            return new Error(
                'Não foi possível salvar o usuário'
            );
        }
    }
}