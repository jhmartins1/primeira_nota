import { prisma } from '../../prisma/client'

interface ClerkUserPayload {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
}

export class ClerkWebhookService {
    async handleUserUpsert(data: ClerkUserPayload) {
        const email = data.email_addresses[0]?.email_address;

        if (!email) {
            throw new Error('Usuário do Clerk sem email');
        }

        const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Sem nome';

        return prisma.usuario.upsert({
            where: { clerkId: data.id },
            update: { name, email, image: data.image_url },
            create: { clerkId: data.id, name, email, image: data.image_url },
        });
    }

    async handleUserDeleted(clerkId: string) {
        await prisma.usuario.deleteMany({ where: { clerkId } });
    }
}