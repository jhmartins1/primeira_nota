import { createClerkClient } from '@clerk/backend';

import { prisma } from '../../prisma/client';

import { isTelefoneValido } from '../../utils/validators';

interface UpdateUsuarioRequest {
    clerkId: string;
    phone?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
}

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
});

const CAMPOS_SELECIONADOS = {
    id: true,
    name: true,
    email: true,
    phone: true,
    image: true,
    cep: true,
    logradouro: true,
    numero: true,
    complemento: true,
    bairro: true,
    cidade: true,
    uf: true,
} as const;

export class UpdateUsuarioService {
    async execute({
        clerkId,
        phone,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
    }: UpdateUsuarioRequest) {
        // VALIDAR TELEFONE
        if (phone !== undefined) {
            if (!isTelefoneValido(phone)) {
                return new Error('Telefone inválido');
            }
        }

        // VALIDAR CEP
        if (cep !== undefined) {
            const cepNumeros = cep.replace(/\D/g, '');

            if (cepNumeros.length !== 8) {
                return new Error('CEP inválido');
            }
        }

        try {
            // VERIFICAR SE USUÁRIO JÁ EXISTE
            const usuarioExists = await prisma.usuario.findUnique({
                where: { clerkId },
            });

            const dadosEndereco = {
                ...(phone !== undefined && {
                    phone: phone.replace(/\D/g, ''),
                }),
                ...(cep !== undefined && {
                    cep: cep.replace(/\D/g, ''),
                }),
                ...(logradouro !== undefined && { logradouro }),
                ...(numero !== undefined && { numero }),
                ...(complemento !== undefined && { complemento }),
                ...(bairro !== undefined && { bairro }),
                ...(cidade !== undefined && { cidade }),
                ...(uf !== undefined && { uf }),
            };

            // USUÁRIO JÁ EXISTE
            if (usuarioExists) {
                const usuario = await prisma.usuario.update({
                    where: {
                        id: usuarioExists.id,
                    },
                    data: dadosEndereco,
                    select: CAMPOS_SELECIONADOS,
                });

                return usuario;
            }

            // PRIMEIRO ACESSO
            const clerkUser = await clerkClient.users.getUser(clerkId);

            const name =
                clerkUser.fullName ||
                clerkUser.firstName ||
                clerkUser.username ||
                'Usuário';

            const email = clerkUser.primaryEmailAddress?.emailAddress;

            if (!email) {
                return new Error(
                    'Não foi possível identificar o e-mail da conta.'
                );
            }

            const image = clerkUser.imageUrl;

            // CRIAR USUÁRIO
            const usuario = await prisma.usuario.create({
                data: {
                    clerkId,
                    name,
                    email,
                    image,
                    ...dadosEndereco,
                },
                select: CAMPOS_SELECIONADOS,
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