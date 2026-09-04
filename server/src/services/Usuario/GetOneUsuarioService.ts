import { prisma } from '../../prisma/client';

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

                cep: true,
                logradouro: true,
                numero: true,
                complemento: true,
                bairro: true,
                cidade: true,
                uf: true,

                instrumentos: {
                    select: {
                        instrumento: { select: { id: true, name: true } },
                        nivel: { select: { id: true, name: true } },
                    },
                },
            },
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const profileComplete =
            !!usuario.phone && !!usuario.cep && !!usuario.numero;

        const onboardingComplete = usuario.instrumentos.length > 0;

        return {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            phone: usuario.phone,
            image: usuario.image,
            createdAt: usuario.createdAt,

            cep: usuario.cep,
            logradouro: usuario.logradouro,
            numero: usuario.numero,
            complemento: usuario.complemento,
            bairro: usuario.bairro,
            cidade: usuario.cidade,
            uf: usuario.uf,

            profileComplete,
            onboardingComplete,

            instrumentos: usuario.instrumentos.map((item) => ({
                instrumento: item.instrumento.name,
                nivel: item.nivel.name,
            })),
        };
    }
}