import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

import {
  Stack,
  usePathname,
  useRouter,
} from 'expo-router';

import { useEffect } from 'react';

import { useContaAutenticada } from '../hooks/useContaAutenticada';

function AuthGuard() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const {
    tipoConta,
    carregandoConta,
  } = useContaAutenticada();

  const pathname =
    usePathname();

  const router =
    useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // ----------------------------------------------------
    // ROTAS
    // ----------------------------------------------------

    const estaNoLogin =
      pathname === '/login';

    const estaNaAreaProfessor =
      pathname === '/professor' ||
      pathname.startsWith('/professor/') ||
      pathname === '/disponibilidade' ||
      pathname === '/remarcar-agendamento-professor';

    const estaNaEdicaoInstrumentos =
      pathname === '/instrument' ||
      pathname === '/level';

    // ----------------------------------------------------
    // USUÁRIO NÃO AUTENTICADO
    // ----------------------------------------------------

    if (
      !isSignedIn &&
      !estaNoLogin
    ) {
      router.replace(
        '/login'
      );

      return;
    }

    // ----------------------------------------------------
    // USUÁRIO AUTENTICADO NO LOGIN
    // ----------------------------------------------------

    if (
      isSignedIn &&
      estaNoLogin
    ) {
      router.replace(
        '/'
      );

      return;
    }

    // ----------------------------------------------------
    // AGUARDANDO IDENTIFICAÇÃO DA CONTA
    // ----------------------------------------------------

    if (
      isSignedIn &&
      carregandoConta
    ) {
      return;
    }

    // ----------------------------------------------------
    // PROFESSOR
    // ----------------------------------------------------

    if (
      isSignedIn &&
      tipoConta ===
      'professor'
    ) {
      if (
        estaNaAreaProfessor ||
        estaNaEdicaoInstrumentos
      ) {
        return;
      }

      router.replace(
        '/professor'
      );

      return;
    }

    // ----------------------------------------------------
    // USUÁRIO
    // ----------------------------------------------------

    if (
      isSignedIn &&
      tipoConta ===
      'usuario'
    ) {
      if (
        estaNaAreaProfessor
      ) {
        router.replace(
          '/'
        );

        return;
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    tipoConta,
    carregandoConta,
    pathname,
    router,
  ]);

  if (
    !isLoaded ||
    (
      isSignedIn &&
      carregandoConta
    )
  ) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown:
          false,
      }}
    />
  );
}

export default function RootLayout() {
  const publishableKey =
    process.env
      .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY não configurada.'
    );
  }

  return (
    <ClerkProvider
      publishableKey={
        publishableKey
      }
      tokenCache={
        tokenCache
      }
    >
      <AuthGuard />
    </ClerkProvider>
  );
}