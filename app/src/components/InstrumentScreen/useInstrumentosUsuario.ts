import { useAuth } from '@clerk/expo';
import { useEffect, useState } from 'react';

export interface InstrumentoUsuario {
    instrumento: string;
    nivel: string;
}

interface UsuarioResponse {
    instrumentos?: InstrumentoUsuario[];
    usuario?: {
        instrumentos?: InstrumentoUsuario[];
    };
}

export type TipoConta = 'usuario' | 'professor';

interface UseInstrumentosUsuarioParams {
    modoEdicao: boolean;
    iniciais: string[];
    tipoConta?: TipoConta;
}

const ENDPOINT_POR_TIPO: Record<TipoConta, string> = {
    usuario: '/usuario/me',
    professor: '/professor/me',
};

export function useInstrumentosUsuario({
    modoEdicao,
    iniciais,
    tipoConta = 'usuario',
}: UseInstrumentosUsuarioParams) {
    const { getToken } = useAuth();

    const [instrumentosSelecionados, setInstrumentosSelecionados] =
        useState<string[]>(
            Array.from(new Set(iniciais))
        );

    /*
     * Para aluno:
     *
     * {
     *   Violão: "Iniciante"
     * }
     *
     * Para professor:
     *
     * {
     *   Teclado: "Iniciante"
     * }
     *
     * ou, futuramente no LevelScreen:
     *
     * {
     *   Teclado: ["Iniciante", "Intermediário"]
     * }
     *
     * Aqui mantemos string porque o LevelScreen
     * fará a conversão conforme o tipo da conta.
     */
    const [niveisExistentes, setNiveisExistentes] =
        useState<Record<string, string>>({});

    const [carregando, setCarregando] =
        useState(modoEdicao);

    useEffect(() => {
        if (!modoEdicao) {
            setInstrumentosSelecionados(
                Array.from(new Set(iniciais))
            );

            setNiveisExistentes({});

            setCarregando(false);

            return;
        }

        let cancelado = false;

        async function carregar() {
            try {
                setCarregando(true);

                const token = await getToken();

                if (!token) {
                    throw new Error(
                        'Token não encontrado.'
                    );
                }

                const endpoint =
                    ENDPOINT_POR_TIPO[tipoConta];

                const API_URL =
                    process.env.EXPO_PUBLIC_API_URL;

                if (!API_URL) {
                    throw new Error(
                        'EXPO_PUBLIC_API_URL não configurada.'
                    );
                }

                const response = await fetch(
                    `${API_URL}${endpoint}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type':
                                'application/json',
                        },
                    }
                );

                const texto =
                    await response.text();

                if (!response.ok) {
                    throw new Error(
                        `Erro ${response.status}: ${texto}`
                    );
                }

                let data: UsuarioResponse;

                try {
                    data = JSON.parse(texto);
                } catch {
                    throw new Error(
                        `Backend não retornou JSON: ${texto}`
                    );
                }

                const lista =
                    data.instrumentos ??
                    data.usuario?.instrumentos ??
                    [];

                /*
                 * Guarda os níveis encontrados para cada
                 * instrumento.
                 *
                 * Exemplo professor:
                 *
                 * Teclado:
                 * [
                 *   "Iniciante",
                 *   "Intermediário"
                 * ]
                 */
                const niveisPorInstrumento: Record<
                    string,
                    string[]
                > = {};

                for (const item of lista) {
                    if (
                        typeof item?.instrumento !==
                        'string' ||
                        typeof item?.nivel !== 'string'
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
                        ] = [];
                    }

                    if (
                        !niveisPorInstrumento[
                            item.instrumento
                        ].includes(item.nivel)
                    ) {
                        niveisPorInstrumento[
                            item.instrumento
                        ].push(item.nivel);
                    }
                }

                const nomes =
                    Object.keys(
                        niveisPorInstrumento
                    );

                /*
                 * Para manter compatibilidade com o aluno,
                 * transformamos:
                 *
                 * Professor:
                 * {
                 *   Teclado: ["Iniciante", "Intermediário"]
                 * }
                 *
                 * em uma estrutura que será interpretada
                 * pelo LevelScreen.
                 */
                const niveis: Record<string, string> =
                    {};

                for (const instrumento of nomes) {
                    niveis[instrumento] =
                        niveisPorInstrumento[
                        instrumento
                        ][0] ?? '';
                }
                /*
                 * Para professor precisamos enviar todos
                 * os níveis existentes para o LevelScreen.
                 *
                 * Usamos JSON.stringify para transportar
                 * a estrutura pelo expo-router.
                 */
                if (!cancelado) {
                    setInstrumentosSelecionados(
                        nomes
                    );

                    if (tipoConta === 'professor') {
                        /*
                         * O LevelScreen receberá os níveis
                         * diretamente através de
                         * niveisExistentes.
                         */
                        setNiveisExistentes(
                            niveisPorInstrumento as unknown as Record<
                                string,
                                string
                            >
                        );
                    } else {
                        /*
                         * Aluno continua com apenas um nível.
                         */
                        setNiveisExistentes(
                            niveis
                        );
                    }
                }
            } catch (error) {
                if (!cancelado) {
                    console.error(
                        `Erro ao carregar instrumentos do ${tipoConta}:`,
                        error
                    );

                    setInstrumentosSelecionados(
                        Array.from(
                            new Set(iniciais)
                        )
                    );

                    setNiveisExistentes({});
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => {
            cancelado = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicao, tipoConta]);

    return {
        instrumentosSelecionados,
        setInstrumentosSelecionados,
        niveisExistentes,
        carregando,
    };
}