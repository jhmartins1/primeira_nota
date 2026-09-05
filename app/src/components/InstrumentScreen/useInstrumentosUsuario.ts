import { useAuth } from '@clerk/expo';

import {
    useEffect,
    useState,
} from 'react';

export interface InstrumentoUsuario {
    instrumento: string;
    nivel: string;

    possuiInstrumento?: boolean;
}

interface UsuarioResponse {
    instrumentos?: InstrumentoUsuario[];

    usuario?: {
        instrumentos?: InstrumentoUsuario[];
    };
}

export type TipoConta =
    | 'usuario'
    | 'professor';

interface UseInstrumentosUsuarioParams {
    modoEdicao: boolean;
    iniciais: string[];
    tipoConta?: TipoConta;
}

const ENDPOINT_POR_TIPO: Record<
    TipoConta,
    string
> = {
    usuario:
        '/usuario/me',

    professor:
        '/professor/me',
};

export function useInstrumentosUsuario({
    modoEdicao,
    iniciais,
    tipoConta = 'usuario',
}: UseInstrumentosUsuarioParams) {
    const {
        getToken,
    } =
        useAuth();

    const [
        instrumentosSelecionados,
        setInstrumentosSelecionados,
    ] =
        useState<
            string[]
        >(
            Array.from(
                new Set(
                    iniciais
                )
            )
        );

    const [
        niveisExistentes,
        setNiveisExistentes,
    ] =
        useState<
            Record<
                string,
                string
            >
        >({});

    const [
        instrumentosPossuidosIniciais,
        setInstrumentosPossuidosIniciais,
    ] =
        useState<
            Record<
                string,
                boolean
            >
        >({});

    const [
        carregando,
        setCarregando,
    ] =
        useState(
            modoEdicao
        );

    useEffect(() => {
        if (
            !modoEdicao
        ) {
            setInstrumentosSelecionados(
                Array.from(
                    new Set(
                        iniciais
                    )
                )
            );

            setNiveisExistentes(
                {}
            );

            setInstrumentosPossuidosIniciais(
                {}
            );

            setCarregando(
                false
            );

            return;
        }

        let cancelado =
            false;

        async function carregar() {
            try {
                setCarregando(
                    true
                );

                const token =
                    await getToken();

                if (
                    !token
                ) {
                    throw new Error(
                        'Token não encontrado.'
                    );
                }

                const endpoint =
                    ENDPOINT_POR_TIPO[
                    tipoConta
                    ];

                const API_URL =
                    process.env
                        .EXPO_PUBLIC_API_URL;

                if (
                    !API_URL
                ) {
                    throw new Error(
                        'EXPO_PUBLIC_API_URL não configurada.'
                    );
                }

                const response =
                    await fetch(
                        `${API_URL}${endpoint}`,
                        {
                            method:
                                'GET',

                            headers:
                            {
                                Authorization:
                                    `Bearer ${token}`,

                                'Content-Type':
                                    'application/json',
                            },
                        }
                    );

                const texto =
                    await response.text();

                if (
                    !response.ok
                ) {
                    throw new Error(
                        `Erro ${response.status}: ${texto}`
                    );
                }

                let data:
                    UsuarioResponse;

                try {
                    data =
                        JSON.parse(
                            texto
                        );
                } catch {
                    throw new Error(
                        `Backend não retornou JSON: ${texto}`
                    );
                }

                const lista =
                    data.instrumentos ??
                    data.usuario
                        ?.instrumentos ??
                    [];

                const niveisPorInstrumento:
                    Record<
                        string,
                        string[]
                    > =
                    {};

                const possuiPorInstrumento:
                    Record<
                        string,
                        boolean
                    > =
                    {};

                for (
                    const item of
                    lista
                ) {
                    if (
                        typeof item?.instrumento !==
                        'string' ||
                        typeof item?.nivel !==
                        'string'
                    ) {
                        continue;
                    }

                    if (
                        !niveisPorInstrumento[
                        item.instrumento
                        ]
                    ) {
                        niveisPorInstrumento[
                            item.instrumento
                        ] =
                            [];
                    }

                    if (
                        !niveisPorInstrumento[
                            item.instrumento
                        ].includes(
                            item.nivel
                        )
                    ) {
                        niveisPorInstrumento[
                            item.instrumento
                        ].push(
                            item.nivel
                        );
                    }

                    if (
                        tipoConta ===
                        'usuario'
                    ) {
                        possuiPorInstrumento[
                            item.instrumento
                        ] =
                            item.possuiInstrumento ===
                            true;
                    }
                }

                const nomes =
                    Object.keys(
                        niveisPorInstrumento
                    );

                const niveis:
                    Record<
                        string,
                        string
                    > =
                    {};

                for (
                    const instrumento of
                    nomes
                ) {
                    niveis[
                        instrumento
                    ] =
                        niveisPorInstrumento[
                        instrumento
                        ][0] ??
                        '';
                }

                if (
                    !cancelado
                ) {
                    setInstrumentosSelecionados(
                        nomes
                    );

                    if (
                        tipoConta ===
                        'professor'
                    ) {
                        setNiveisExistentes(
                            niveisPorInstrumento as unknown as Record<
                                string,
                                string
                            >
                        );

                        setInstrumentosPossuidosIniciais(
                            {}
                        );
                    } else {
                        setNiveisExistentes(
                            niveis
                        );

                        setInstrumentosPossuidosIniciais(
                            possuiPorInstrumento
                        );
                    }
                }
            } catch (
            error
            ) {
                if (
                    !cancelado
                ) {
                    console.error(
                        `Erro ao carregar instrumentos do ${tipoConta}:`,
                        error
                    );

                    setInstrumentosSelecionados(
                        Array.from(
                            new Set(
                                iniciais
                            )
                        )
                    );

                    setNiveisExistentes(
                        {}
                    );

                    setInstrumentosPossuidosIniciais(
                        {}
                    );
                }
            } finally {
                if (
                    !cancelado
                ) {
                    setCarregando(
                        false
                    );
                }
            }
        }

        carregar();

        return () => {
            cancelado =
                true;
        };
    }, [
        modoEdicao,
        tipoConta,
    ]);

    return {
        instrumentosSelecionados,
        setInstrumentosSelecionados,

        niveisExistentes,

        instrumentosPossuidosIniciais,

        carregando,
    };
}