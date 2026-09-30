import { prisma } from '../../prisma/client';

export class GetOneUsuarioService {
    async execute(id: number) {
        const usuario =
            await prisma.usuario.findUnique({
                where: {
                    id,
                },

                select: {
                    id: true,

                    name: true,
                    email: true,
                    phone: true,
                    image: true,

                    nomeAluno: true,
                    faixaEtaria: true,

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
                            possuiInstrumento:
                                true,

                            instrumento: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },

                            nivel: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

        if (!usuario) {
            throw new Error(
                'Usuário não encontrado'
            );
        }

        // =========================
        // PERFIL COMPLETO
        // =========================

        const profileComplete =
            !!usuario.nomeAluno &&
            !!usuario.faixaEtaria &&
            !!usuario.phone &&
            !!usuario.cep &&
            !!usuario.logradouro &&
            !!usuario.numero &&
            !!usuario.bairro &&
            !!usuario.cidade &&
            !!usuario.uf;

        // =========================
        // ONBOARDING
        // =========================

        const onboardingComplete =
            usuario.instrumentos.length > 0;

        return {
            id: usuario.id,

            // Dono da conta (Clerk)
            name: usuario.name,

            // Aluno
            nomeAluno:
                usuario.nomeAluno,

            faixaEtaria:
                usuario.faixaEtaria,

            email: usuario.email,
            phone: usuario.phone,
            image: usuario.image,

            createdAt:
                usuario.createdAt,

            // Endereço
            cep: usuario.cep,

            logradouro:
                usuario.logradouro,

            numero: usuario.numero,

            complemento:
                usuario.complemento,

            bairro: usuario.bairro,

            cidade: usuario.cidade,

            uf: usuario.uf,

            profileComplete,
            onboardingComplete,

            instrumentos:
                usuario.instrumentos.map(
                    (item) => ({
                        instrumento:
                            item.instrumento
                                .name,

                        nivel:
                            item.nivel.name,

                        possuiInstrumento:
                            item.possuiInstrumento,
                    })
                ),
        };
    }
}