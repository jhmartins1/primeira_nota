// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getOnboardingCompleto } from '../utils/onboarding';

export default function Index() {
  const [carregando, setCarregando] = useState(true);
  const [onboardingCompleto, setOnboardingCompleto] = useState(false);

  useEffect(() => {
    getOnboardingCompleto().then((completo) => {
      setOnboardingCompleto(completo);
      setCarregando(false);
    });
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Redirect href={onboardingCompleto ? '/home' : '/instrument'} />
  );
}