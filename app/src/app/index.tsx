import { useAuth, useUser } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';

import { useContaAutenticada } from '../hooks/useContaAutenticada';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const {
    tipoConta,
    carregandoConta,
  } = useContaAutenticada();

  const [carregando, setCarregando] = useState(true);
  const [telefonePreenchido, setTelefonePreenchido] =
    useState(false);
  const [onboardingCompleto, setOnboardingCompleto] =
    useState(false);

  useEffect(() => {
    if (!isLoaded || carregandoConta) {
      return;
    }

    if (!user) {
      setCarregando(false);
      return;
    }

    // Professor não passa pelo onboarding do aluno.
    if (tipoConta === 'professor') {
      setCarregando(false);
      return;
    }

    // Se ainda não conseguimos identificar a conta,
    // não fazemos nenhuma chamada específica de usuário.
    if (tipoConta === null) {
      setCarregando(false);
      return;
    }

    async function carregarDadosUsuario() {
      try {
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
          `${API_URL}/usuario/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(
            `Erro ao buscar usuário: ${response.status} - ${responseText}`
          );
        }

        const usuario = JSON.parse(responseText);

        const possuiTelefone =
          typeof usuario.phone === 'string' &&
          usuario.phone.trim().length > 0;

        setTelefonePreenchido(possuiTelefone);

        const completo =
          usuario.onboardingComplete === true;

        setOnboardingCompleto(completo);
      } catch (error) {
        console.error(
          'Erro ao carregar dados do usuário:',
          error
        );

        setTelefonePreenchido(false);
        setOnboardingCompleto(false);
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosUsuario();
  }, [
    isLoaded,
    carregandoConta,
    tipoConta,
    user,
    getToken,
  ]);

  if (
    !isLoaded ||
    carregando ||
    carregandoConta
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  // PROFESSOR
  if (tipoConta === 'professor') {
    return <Redirect href="/professor" />;
  }

  // USUÁRIO
  if (!telefonePreenchido) {
    return <Redirect href="/complete-profile" />;
  }

  if (!onboardingCompleto) {
    return <Redirect href="/instrument" />;
  }

  return <Redirect href="/home" />;
}