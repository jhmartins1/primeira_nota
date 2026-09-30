import { createClerkClient } from '@clerk/backend';

import { prisma } from '../../prisma/client';
import { isTelefoneValido } from '../../utils/validators';

type FaixaEtaria =
    | 'ATE_6'
    | 'DE_7_A_10'
    | 'DE_11_A_14'
    | 'DE_15_A_17'
    | 'ADULTO';

interface UpdateUsuarioRequest {
    clerkId: string;

    nomeAluno?: string;
    faixaEtaria?: FaixaEtaria;

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

const FAIXAS_ETARIAS_VALIDAS: FaixaEtaria[] = [
    'ATE_6',
    'DE_7_A_10',
    'DE_11_A_14',
    'DE_15_A_17',
    'ADULTO',
];

const CAMPOS_SELECIONADOS = {
    id: true,

    name: true,
    email: true,
    phone: true,
    image: true,

    nomeAluno: true,
    faixaEtaria: true,

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

        nomeAluno,
        faixaEtaria,

        phone,

        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
    }: UpdateUsuarioRequest) {
        // =========================
        // VALIDAR NOME DO ALUNO
        // =========================

        if (nomeAluno !== undefined) {
            const nomeFormatado =
                nomeAluno.trim();

            if (nomeFormatado.length < 2) {
                return new Error(
                    'Nome do aluno inválido'
                );
            }

            if (nomeFormatado.length > 100) {
                return new Error(
                    'Nome do aluno deve ter no máximo 100 caracteres'
                );
            }
        }

        // =========================
        // VALIDAR FAIXA ETÁRIA
        // =========================

        if (faixaEtaria !== undefined) {
            if (
                !FAIXAS_ETARIAS_VALIDAS.includes(
                    faixaEtaria
                )
            ) {
                return new Error(
                    'Faixa etária inválida'
                );
            }
        }

        // =========================
        // VALIDAR TELEFONE
        // =========================

        if (phone !== undefined) {
            if (!isTelefoneValido(phone)) {
                return new Error(
                    'Telefone inválido'
                );
            }
        }

        // =========================
        // VALIDAR CEP
        // =========================

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
            // =========================
            // DADOS A SEREM ATUALIZADOS
            // =========================

            const dadosUsuario = {
                ...(nomeAluno !== undefined && {
                    nomeAluno:
                        nomeAluno.trim(),
                }),

                ...(faixaEtaria !== undefined && {
                    faixaEtaria,
                }),

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
                    logradouro:
                        logradouro.trim(),
                }),

                ...(numero !== undefined && {
                    numero: numero.trim(),
                }),

                ...(complemento !==
                    undefined && {
                    complemento:
                        complemento.trim(),
                }),

                ...(bairro !== undefined && {
                    bairro: bairro.trim(),
                }),

                ...(cidade !== undefined && {
                    cidade: cidade.trim(),
                }),

                ...(uf !== undefined && {
                    uf: uf
                        .trim()
                        .toUpperCase(),
                }),
            };

            // =========================
            // 1. PROCURAR PELO CLERK ID
            // =========================

            const usuarioPorClerkId =
                await prisma.usuario.findUnique({
                    where: {
                        clerkId,
                    },
                });

            // Usuário já vinculado
            if (usuarioPorClerkId) {
                const usuario =
                    await prisma.usuario.update({
                        where: {
                            id: usuarioPorClerkId.id,
                        },

                        data: dadosUsuario,

                        select:
                            CAMPOS_SELECIONADOS,
                    });

                return usuario;
            }

            // =========================
            // CONSULTAR CLERK
            // =========================

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

            // =========================
            // 2. PROCURAR PELO E-MAIL
            // =========================

            const usuarioPorEmail =
                await prisma.usuario.findUnique({
                    where: {
                        email,
                    },
                });

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

                            ...dadosUsuario,
                        },

                        select:
                            CAMPOS_SELECIONADOS,
                    });

                return usuario;
            }

            // =========================
            // 3. USUÁRIO NOVO
            // =========================

            const usuario =
                await prisma.usuario.create({
                    data: {
                        clerkId,
                        name,
                        email,
                        image,

                        ...dadosUsuario,
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