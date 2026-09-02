import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const estaNoLogin = segments[0] === 'login';

    // Usuário não autenticado
    if (!isSignedIn && !estaNoLogin) {
      router.replace('/login');
      return;
    }

    // Usuário autenticado tentando acessar login
    if (isSignedIn && estaNoLogin) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  const publishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY não configurada.'
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <AuthGuard />
    </ClerkProvider>
  );
}