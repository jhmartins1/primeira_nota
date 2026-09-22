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
                return new Error(
                    'Telefone inválido'
                );
            }
        }

        // VALIDAR CEP
        if (cep !== undefined) {
            const cepNumeros =
                cep.replace(/\D/g, '');

            if (cepNumeros.length !== 8) {
                return new Error(
                    'CEP inválido'
                );
            }
        }

        try {
            const dadosEndereco = {
                ...(phone !== undefined && {
                    phone: phone.replace(
                        /\D/g,
                        ''
                    ),
                }),

                ...(cep !== undefined && {
                    cep: cep.replace(
                        /\D/g,
                        ''
                    ),
                }),

                ...(logradouro !==
                    undefined && {
                    logradouro,
                }),

                ...(numero !== undefined && {
                    numero,
                }),

                ...(complemento !==
                    undefined && {
                    complemento,
                }),

                ...(bairro !== undefined && {
                    bairro,
                }),

                ...(cidade !== undefined && {
                    cidade,
                }),

                ...(uf !== undefined && {
                    uf,
                }),
            };

            // 1. PRIMEIRO TENTA LOCALIZAR PELO CLERK ID
            const usuarioPorClerkId =
                await prisma.usuario.findUnique({
                    where: {
                        clerkId,
                    },
                });

            // USUÁRIO JÁ ESTÁ VINCULADO AO CLERK ATUAL
            if (usuarioPorClerkId) {
                const usuario =
                    await prisma.usuario.update({
                        where: {
                            id: usuarioPorClerkId.id,
                        },

                        data: dadosEndereco,

                        select:
                            CAMPOS_SELECIONADOS,
                    });

                return usuario;
            }

            /*
             * Não encontramos o clerkId.
             *
             * Precisamos consultar o Clerk antes de criar
             * porque pode existir um usuário antigo no
             * banco com o mesmo e-mail.
             */
            const clerkUser =
                await clerkClient.users.getUser(
                    clerkId
                );

            const name =
                clerkUser.fullName ||
                clerkUser.firstName ||
                clerkUser.username ||
                'Usuário';

            const email =
                clerkUser.primaryEmailAddress
                    ?.emailAddress;

            if (!email) {
                return new Error(
                    'Não foi possível identificar o e-mail da conta.'
                );
            }

            const image =
                clerkUser.imageUrl;

            // 2. VERIFICAR SE O E-MAIL JÁ EXISTE
            const usuarioPorEmail =
                await prisma.usuario.findUnique({
                    where: {
                        email,
                    },
                });

            /*
             * O usuário já existia no nosso banco,
             * mas estava associado a outro clerkId.
             *
             * Em vez de criar outro registro,
             * vinculamos o registro existente ao
             * clerkId atual.
             */
            if (usuarioPorEmail) {
                const usuario =
                    await prisma.usuario.update({
                        where: {
                            id: usuarioPorEmail.id,
                        },

                        data: {
                            clerkId,
                            name,
                            email,
                            image,
                            ...dadosEndereco,
                        },

                        select:
                            CAMPOS_SELECIONADOS,
                    });

                return usuario;
            }

            // 3. USUÁRIO REALMENTE NOVO
            const usuario =
                await prisma.usuario.create({
                    data: {
                        clerkId,
                        name,
                        email,
                        image,
                        ...dadosEndereco,
                    },

                    select:
                        CAMPOS_SELECIONADOS,
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