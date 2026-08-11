import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@primeira_nota:onboarding_completo';
const SELECAO_KEY = '@primeira_nota:selecao';

// instrumento -> nível
export type Selecao = Record<string, string>;

export async function getOnboardingCompleto(): Promise<boolean> {
    try {
        const valor = await AsyncStorage.getItem(ONBOARDING_KEY);
        return valor === 'true';
    } catch {
        return false;
    }
}

export async function setOnboardingCompleto(): Promise<void> {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
        console.error('Erro ao salvar onboarding:', error);
    }
}

export async function getSelecao(): Promise<Selecao> {
    try {
        const valor = await AsyncStorage.getItem(SELECAO_KEY);
        return valor ? (JSON.parse(valor) as Selecao) : {};
    } catch {
        return {};
    }
}

export async function setSelecao(selecao: Selecao): Promise<void> {
    try {
        await AsyncStorage.setItem(SELECAO_KEY, JSON.stringify(selecao));
    } catch (error) {
        console.error('Erro ao salvar seleção:', error);
    }
}