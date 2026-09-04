import { useAuth } from '@clerk/expo';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { formatarDataBrasilia } from './formatters';
import { Agendamento, Usuario } from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useHomeData() {
    const { getToken, signOut } = useAuth();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [cancelandoId, setCancelandoId] = useState<number | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [saindo, setSaindo] = useState(false);

    const carregarDados = async (mostrarLoading = true) => {
        try {
            if (!API_URL) {
                throw new Error('EXPO_PUBLIC_API_URL não configurada.');
            }

            if (mostrarLoading) {
                setCarregando(true);
            } else {
                setAtualizando(true);
            }

            setErro(null);

            const token = await getToken();
            if (!token) {
                throw new Error('Token de autenticação não encontrado.');
            }

            // USUÁRIO
            const usuarioResponse = await fetch(`${API_URL}/usuario/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!usuarioResponse.ok) {
                throw new Error(`Erro ao buscar usuário: ${usuarioResponse.status}`);
            }

            const usuarioData = await usuarioResponse.json();
            setUsuario(usuarioData);

            // AGENDAMENTOS
            const agendamentosResponse = await fetch(`${API_URL}/agendamento`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!agendamentosResponse.ok) {
                throw new Error(`Erro ao buscar agendamentos: ${agendamentosResponse.status}`);
            }

            const agendamentosData = await agendamentosResponse.json();
            const lista: Agendamento[] = Array.isArray(agendamentosData) ? agendamentosData : [];

            const futuros = lista
                .filter(
                    (item) =>
                        item.status === 'AGENDADO' &&
                        new Date(item.dataHora).getTime() > Date.now()
                )
                .sort(
                    (a, b) =>
                        new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
                );

            setAgendamentos(futuros);
        } catch (error) {
            console.error('Erro ao carregar Home:', error);

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

    const proximaAula = agendamentos.length > 0 ? agendamentos[0] : null;
    const demaisAulas = agendamentos.slice(1, 4);

    // LOGOUT
    function confirmarLogout() {
        Alert.alert('Sair da conta?', 'Você será desconectado da sua conta.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: realizarLogout },
        ]);
    }

    async function realizarLogout() {
        try {
            setSaindo(true);
            await signOut();
            // O AuthGuard do _layout.tsx detectará que o usuário não está
            // mais autenticado e redirecionará automaticamente para /login.
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
        } finally {
            setSaindo(false);
        }
    }

    // CANCELAR AULA
    function confirmarCancelamento(agendamento: Agendamento) {
        const data = formatarDataBrasilia(agendamento.dataHora);

        Alert.alert(
            'Cancelar aula?',
            `Tem certeza que deseja cancelar sua aula de ${agendamento.instrumento.name} com ${agendamento.professor.name} em ${data.data} às ${data.hora}?`,
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Cancelar aula',
                    style: 'destructive',
                    onPress: () => cancelarAula(agendamento),
                },
            ]
        );
    }

    async function cancelarAula(agendamento: Agendamento) {
        try {
            setCancelandoId(agendamento.id);

            if (!API_URL) {
                throw new Error('EXPO_PUBLIC_API_URL não configurada.');
            }

            const token = await getToken();
            if (!token) {
                throw new Error('Token de autenticação não encontrado.');
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
                let mensagem = 'Não foi possível cancelar a aula.';

                try {
                    const erroBody = JSON.parse(texto);
                    if (erroBody.error) {
                        mensagem = erroBody.error;
                    }
                } catch { }

                throw new Error(mensagem);
            }

            setAgendamentos((listaAtual) =>
                listaAtual.filter((item) => item.id !== agendamento.id)
            );

            Alert.alert('Aula cancelada', 'Sua aula foi cancelada com sucesso.');

            await carregarDados(false);
        } catch (error) {
            console.error('Erro ao cancelar aula:', error);

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

    return {
        usuario,
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
        confirmarLogout,
        confirmarCancelamento,
    };
}