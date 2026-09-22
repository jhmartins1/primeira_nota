import { prisma } from '../../prisma/client';

interface ClerkUserPayload {
    id: string;

    email_addresses: {
        email_address: string;
    }[];

    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
}

export class ClerkWebhookService {
    async handleUserUpsert(
        data: ClerkUserPayload
    ) {
        const email =
            data.email_addresses[0]
                ?.email_address;

        if (!email) {
            throw new Error(
                'Usuário do Clerk sem email'
            );
        }

        const name =
            [
                data.first_name,
                data.last_name,
            ]
                .filter(Boolean)
                .join(' ') ||
            'Sem nome';

        /*
         * 1. Verifica se já existe usuário
         * vinculado ao clerkId atual.
         */
        const usuarioPorClerkId =
            await prisma.usuario.findUnique({
                where: {
                    clerkId: data.id,
                },
            });

        if (usuarioPorClerkId) {
            return prisma.usuario.update({
                where: {
                    id: usuarioPorClerkId.id,
                },

                data: {
                    name,
                    email,
                    image: data.image_url,
                },
            });
        }

        /*
         * 2. Não existe com esse clerkId.
         *
         * Verifica se já existe um registro
         * com o mesmo e-mail.
         */
        const usuarioPorEmail =
            await prisma.usuario.findUnique({
                where: {
                    email,
                },
            });

        /*
         * Mesmo usuário, mas com um novo
         * clerkId.
         *
         * Preservamos todos os dados existentes
         * (telefone, endereço, instrumentos etc.)
         * e atualizamos apenas os dados vindos
         * do Clerk.
         */
        if (usuarioPorEmail) {
            return prisma.usuario.update({
                where: {
                    id: usuarioPorEmail.id,
                },

                data: {
                    clerkId: data.id,
                    name,
                    email,
                    image: data.image_url,
                },
            });
        }

        /*
         * 3. Não existe nem pelo clerkId
         * nem pelo e-mail.
         *
         * É realmente um usuário novo.
         */
        return prisma.usuario.create({
            data: {
                clerkId: data.id,
                name,
                email,
                image: data.image_url,
            },
        });
    }

    async handleUserDeleted(
        clerkId: string
    ) {
        await prisma.usuario.deleteMany({
            where: {
                clerkId,
            },
        });
    }
}