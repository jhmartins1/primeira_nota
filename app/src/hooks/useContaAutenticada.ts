import { useAuth } from '@clerk/expo';

import { useEffect, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type TipoConta = 'usuario' | 'professor' | null;

interface ContaAutenticadaResponse {
    tipoConta: 'usuario' | 'professor';
    id: number;
}

export function useContaAutenticada() {
    const { getToken, isSignedIn } = useAuth();

    const [tipoConta, setTipoConta] =
        useState<TipoConta>(null);

    const [carregandoConta, setCarregandoConta] =
        useState(true);

    useEffect(() => {
        let cancelado = false;

        async function buscarConta(token: string) {
            const response = await fetch(
                `${API_URL}/conta/me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const responseText = await response.text();

            return { response, responseText };
        }

        async function tentarVincularProfessor(
            token: string
        ) {
            try {
                const response = await fetch(
                    `${API_URL}/professor/vincular-conta`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                return response.ok;
            } catch (error) {
                console.error(
                    'Erro ao tentar vincular conta de professor:',
                    error
                );

                return false;
            }
        }

        async function identificarConta() {
            // USUÁRIO NÃO AUTENTICADO
            if (!isSignedIn) {
                if (!cancelado) {
                    setTipoConta(null);
                    setCarregandoConta(false);
                }

                return;
            }

            try {
                setCarregandoConta(true);

                // VALIDAR API
                if (!API_URL) {
                    throw new Error(
                        'EXPO_PUBLIC_API_URL não configurada.'
                    );
                }

                // OBTER TOKEN CLERK
                const token = await getToken();

                if (!token) {
                    throw new Error(
                        'Token de autenticação não encontrado.'
                    );
                }

                // BUSCAR CONTA
                let { response, responseText } =
                    await buscarConta(token);

                if (response.status === 404) {
                    const vinculou =
                        await tentarVincularProfessor(token);

                    if (vinculou) {
                        // Reconsulta agora que o clerkId
                        // foi vinculado ao professor.
                        ({ response, responseText } =
                            await buscarConta(token));
                    }

                    if (response.status === 404) {
                        if (!cancelado) {
                            setTipoConta(null);
                        }

                        return;
                    }
                }

                if (!response.ok) {
                    throw new Error(
                        `Erro ao identificar conta: ${response.status} - ${responseText}`
                    );
                }

                const conta: ContaAutenticadaResponse =
                    JSON.parse(responseText);

                if (
                    conta.tipoConta !== 'usuario' &&
                    conta.tipoConta !== 'professor'
                ) {
                    throw new Error(
                        'Tipo de conta inválido retornado pela API.'
                    );
                }

                if (!cancelado) {
                    setTipoConta(conta.tipoConta);
                }
            } catch (error) {
                console.error(
                    'Erro ao identificar tipo de conta:',
                    error
                );

                if (!cancelado) {
                    setTipoConta(null);
                }
            } finally {
                if (!cancelado) {
                    setCarregandoConta(false);
                }
            }
        }

        identificarConta();

        return () => {
            cancelado = true;
        };

        // O getToken é estável para esse efeito.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    return {
        tipoConta,
        carregandoConta,
    };
}