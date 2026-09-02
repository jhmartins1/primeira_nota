import AsyncStorage from '@react-native-async-storage/async-storage';

function getChaveOnboarding(userId: string) {
    return `onboardingCompleto_${userId}`;
}

export async function getOnboardingCompleto(
    userId: string
): Promise<boolean> {
    try {
        const chave = getChaveOnboarding(userId);

        const valor = await AsyncStorage.getItem(chave);

        return valor === 'true';
    } catch (error) {
        console.error(
            'Erro ao verificar onboarding:',
            error
        );

        return false;
    }
}

export async function salvarOnboardingCompleto(
    userId: string
): Promise<void> {
    try {
        const chave = getChaveOnboarding(userId);

        await AsyncStorage.setItem(chave, 'true');
    } catch (error) {
        console.error(
            'Erro ao salvar onboarding:',
            error
        );
    }
}

export async function limparOnboarding(
    userId: string
): Promise<void> {
    try {
        const chave = getChaveOnboarding(userId);

        await AsyncStorage.removeItem(chave);
    } catch (error) {
        console.error(
            'Erro ao limpar onboarding:',
            error
        );
    }
}