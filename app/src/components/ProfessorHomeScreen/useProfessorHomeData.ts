import { useAuth } from '@clerk/expo';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { formatarDataBrasilia } from '../HomeScreen/formatters';
import {
    AgendamentoProfessor,
    ProfessorLogado,
} from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useProfessorHomeData() {
    const { getToken, signOut } = useAuth();

    const [professor, setProfessor] =
        useState<ProfessorLogado | null>(null);

    const [agendamentos, setAgendamentos] =
        useState<AgendamentoProfessor[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    const [cancelandoId, setCancelandoId] =
        useState<number | null>(null);

    const [erro, setErro] = useState<string | null>(null);
    const [saindo, setSaindo] = useState(false);

    const carregarDados = async (mostrarLoading = true) => {
        try {
            if (!API_URL) {
                throw new Error(
                    'EXPO_PUBLIC_API_URL não configurada.'
                );
            }

            if (mostrarLoading) {
                setCarregando(true);
            } else {
                setAtualizando(true);
            }

            setErro(null);

            const token = await getToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // ----------------------------------------------------
            // PROFESSOR
            // ----------------------------------------------------

            const professorResponse =
                await fetch(`${API_URL}/professor/me`, {
                    method: 'GET',
                    headers,
                });

            if (!professorResponse.ok) {
                throw new Error(
                    `Erro ao buscar professor: ${professorResponse.status}`
                );
            }

            const professorData =
                await professorResponse.json();

            setProfessor(professorData);

            // ----------------------------------------------------
            // AGENDAMENTOS
            // ----------------------------------------------------

            const agendamentosResponse =
                await fetch(
                    `${API_URL}/agendamento/professor`,
                    {
                        method: 'GET',
                        headers,
                    }
                );

            if (!agendamentosResponse.ok) {
                throw new Error(
                    `Erro ao buscar agendamentos: ${agendamentosResponse.status}`
                );
            }

            const agendamentosData =
                await agendamentosResponse.json();

            const lista: AgendamentoProfessor[] =
                Array.isArray(agendamentosData)
                    ? agendamentosData
                    : [];

            const futuros = lista
                .filter(
                    (item) =>
                        item.status === 'AGENDADO' &&
                        new Date(item.dataHora).getTime() >
                        Date.now()
                )
                .sort(
                    (a, b) =>
                        new Date(a.dataHora).getTime() -
                        new Date(b.dataHora).getTime()
                );

            setAgendamentos(futuros);
        } catch (error) {
            console.error(
                'Erro ao carregar Home do professor:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar os dados.'
            );
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    };

    useEffect(() => {
        carregarDados();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function atualizarTela() {
        await carregarDados(false);
    }

    // ----------------------------------------------------
    // LOGOUT
    // ----------------------------------------------------

    async function realizarLogout() {
        try {
            setSaindo(true);
            await signOut();
        } catch (error) {
            console.error(
                'Erro ao fazer logout:',
                error
            );

            Alert.alert(
                'Erro',
                'Não foi possível sair da conta. Tente novamente.'
            );
        } finally {
            setSaindo(false);
        }
    }

    // ----------------------------------------------------
    // CANCELAR AULA
    // ----------------------------------------------------

    function confirmarCancelamento(
        agendamento: AgendamentoProfessor
    ) {
        const data = formatarDataBrasilia(
            agendamento.dataHora
        );

        Alert.alert(
            'Cancelar aula?',
            `Tem certeza que deseja cancelar a aula de ${agendamento.instrumento.name} com ${agendamento.usuario.name} em ${data.data} às ${data.hora}?`,
            [
                {
                    text: 'Voltar',
                    style: 'cancel',
                },
                {
                    text: 'Cancelar aula',
                    style: 'destructive',
                    onPress: () => cancelarAula(agendamento),
                },
            ]
        );
    }

    async function cancelarAula(
        agendamento: AgendamentoProfessor
    ) {
        try {
            setCancelandoId(agendamento.id);

            if (!API_URL) {
                throw new Error(
                    'EXPO_PUBLIC_API_URL não configurada.'
                );
            }

            const token = await getToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }

            const response = await fetch(
                `${API_URL}/agendamento/${agendamento.id}/cancelar`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível cancelar a aula.';

                try {
                    const erroBody = JSON.parse(texto);

                    if (erroBody.error) {
                        mensagem = erroBody.error;
                    }
                } catch {
                    // resposta não era JSON
                }

                throw new Error(mensagem);
            }

            // Remove imediatamente da lista
            setAgendamentos((listaAtual) =>
                listaAtual.filter(
                    (item) => item.id !== agendamento.id
                )
            );

            Alert.alert(
                'Aula cancelada',
                `A aula de ${agendamento.usuario.name} foi cancelada com sucesso.`
            );

            // Garante que a Home fique sincronizada
            await carregarDados(false);
        } catch (error) {
            console.error(
                'Erro ao cancelar aula:',
                error
            );

            Alert.alert(
                'Erro',
                error instanceof Error
                    ? error.message
                    : 'Não foi possível cancelar a aula.'
            );
        } finally {
            setCancelandoId(null);
        }
    }

    const proximaAula =
        agendamentos.length > 0
            ? agendamentos[0]
            : null;

    const demaisAulas =
        agendamentos.slice(1);

    return {
        professor,
        agendamentos,
        carregando,
        atualizando,
        cancelandoId,
        erro,
        saindo,
        proximaAula,
        demaisAulas,
        carregarDados,
        atualizarTela,
        realizarLogout,
        confirmarCancelamento,
    };
}