import { useAuth } from '@clerk/expo';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { DisponibilidadeProfessor } from './types';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

export function useDisponibilidade() {
    const { getToken } =
        useAuth();

    const [
        disponibilidades,
        setDisponibilidades,
    ] = useState<
        DisponibilidadeProfessor[]
    >([]);

    const [
        carregando,
        setCarregando,
    ] = useState(true);

    const [
        salvando,
        setSalvando,
    ] = useState(false);

    const [
        removendoId,
        setRemovendoId,
    ] = useState<
        number | null
    >(null);

    const [
        removendoDia,
        setRemovendoDia,
    ] = useState<
        string | null
    >(null);

    const [
        erro,
        setErro,
    ] = useState<
        string | null
    >(null);

    async function headers() {
        const token =
            await getToken();

        if (!token) {
            throw new Error(
                'Token de autenticação não encontrado.'
            );
        }

        return {
            Authorization:
                `Bearer ${token}`,

            'Content-Type':
                'application/json',
        };
    }

    async function carregarDisponibilidades() {
        try {
            setCarregando(
                true
            );

            setErro(null);

            const h =
                await headers();

            const response =
                await fetch(
                    `${API_URL}/professor/disponibilidade`,
                    {
                        method:
                            'GET',

                        headers:
                            h,
                    }
                );

            const texto =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    `Erro ao buscar disponibilidades: ${response.status}`
                );
            }

            const data =
                JSON.parse(
                    texto
                );

            setDisponibilidades(
                Array.isArray(
                    data
                )
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                'Erro ao carregar disponibilidades:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar os horários.'
            );
        } finally {
            setCarregando(
                false
            );
        }
    }

    useEffect(() => {
        carregarDisponibilidades();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function criarDisponibilidade(
        data: Date,
        horarios: string[],
        repetirSeteDiasUteis: boolean
    ) {
        try {
            setSalvando(
                true
            );

            const h =
                await headers();

            const ano =
                data.getFullYear();

            const mes =
                String(
                    data.getMonth() +
                    1
                ).padStart(
                    2,
                    '0'
                );

            const dia =
                String(
                    data.getDate()
                ).padStart(
                    2,
                    '0'
                );

            const dataInicial =
                `${ano}-${mes}-${dia}`;

            const response =
                await fetch(
                    `${API_URL}/professor/disponibilidade`,
                    {
                        method:
                            'POST',

                        headers:
                            h,

                        body:
                            JSON.stringify(
                                {
                                    dataInicial,
                                    horarios,
                                    repetirSeteDiasUteis,
                                }
                            ),
                    }
                );

            const texto =
                await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível cadastrar os horários.';

                try {
                    const erroBody =
                        JSON.parse(
                            texto
                        );

                    if (
                        erroBody.error
                    ) {
                        mensagem =
                            erroBody.error;
                    }
                } catch { }

                throw new Error(
                    mensagem
                );
            }

            await carregarDisponibilidades();

            return true;
        } catch (error) {
            console.error(
                'Erro ao criar disponibilidades:',
                error
            );

            Alert.alert(
                'Erro',

                error instanceof Error
                    ? error.message
                    : 'Não foi possível cadastrar os horários.'
            );

            return false;
        } finally {
            setSalvando(
                false
            );
        }
    }

    function confirmarRemocao(
        disponibilidade:
            DisponibilidadeProfessor
    ) {
        Alert.alert(
            'Remover horário?',

            'Este horário deixará de aparecer como disponível para os alunos agendarem.',

            [
                {
                    text:
                        'Voltar',

                    style:
                        'cancel',
                },

                {
                    text:
                        'Remover',

                    style:
                        'destructive',

                    onPress: () =>
                        removerDisponibilidade(
                            disponibilidade.id
                        ),
                },
            ]
        );
    }

    async function removerDisponibilidade(
        id: number
    ) {
        try {
            setRemovendoId(
                id
            );

            const h =
                await headers();

            const response =
                await fetch(
                    `${API_URL}/professor/disponibilidade/${id}`,
                    {
                        method:
                            'DELETE',

                        headers:
                            h,
                    }
                );

            const texto =
                await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível remover o horário.';

                try {
                    const erroBody =
                        JSON.parse(
                            texto
                        );

                    if (
                        erroBody.error
                    ) {
                        mensagem =
                            erroBody.error;
                    }
                } catch { }

                throw new Error(
                    mensagem
                );
            }

            setDisponibilidades(
                (atual) =>
                    atual.filter(
                        (item) =>
                            item.id !==
                            id
                    )
            );
        } catch (error) {
            console.error(
                'Erro ao remover disponibilidade:',
                error
            );

            Alert.alert(
                'Erro',

                error instanceof Error
                    ? error.message
                    : 'Não foi possível remover o horário.'
            );
        } finally {
            setRemovendoId(
                null
            );
        }
    }

    function confirmarRemocaoDia(
        data: string,
        dataLabel: string
    ) {
        Alert.alert(
            'Apagar todos os horários?',

            `Todos os horários de ${dataLabel} serão removidos. Esta ação não pode ser desfeita.`,

            [
                {
                    text:
                        'Cancelar',

                    style:
                        'cancel',
                },

                {
                    text:
                        'Apagar todos',

                    style:
                        'destructive',

                    onPress: () =>
                        removerDisponibilidadesDia(
                            data
                        ),
                },
            ]
        );
    }

    async function removerDisponibilidadesDia(
        data: string
    ) {
        try {
            setRemovendoDia(
                data
            );

            const h =
                await headers();

            const response =
                await fetch(
                    `${API_URL}/professor/disponibilidade/dia/${data}`,
                    {
                        method:
                            'DELETE',

                        headers:
                            h,
                    }
                );

            const texto =
                await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível remover os horários deste dia.';

                try {
                    const erroBody =
                        JSON.parse(
                            texto
                        );

                    if (
                        erroBody.error
                    ) {
                        mensagem =
                            erroBody.error;
                    }
                } catch { }

                throw new Error(
                    mensagem
                );
            }

            await carregarDisponibilidades();
        } catch (error) {
            console.error(
                'Erro ao remover horários do dia:',
                error
            );

            Alert.alert(
                'Erro',

                error instanceof Error
                    ? error.message
                    : 'Não foi possível remover os horários deste dia.'
            );
        } finally {
            setRemovendoDia(
                null
            );
        }
    }

    return {
        disponibilidades,
        carregando,
        salvando,
        removendoId,
        removendoDia,
        erro,
        carregarDisponibilidades,
        criarDisponibilidade,
        confirmarRemocao,
        confirmarRemocaoDia,
    };
}