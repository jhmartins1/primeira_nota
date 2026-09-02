import { useSignInWithGoogle } from '@clerk/expo/google';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './LoginScreen.styles';

export function LoginScreen() {
    const { startGoogleAuthenticationFlow } =
        useSignInWithGoogle();

    const router = useRouter();
    const [carregando, setCarregando] = useState(false);

    async function handleLoginGoogle() {
        try {
            setCarregando(true);

            const { createdSessionId, setActive } =
                await startGoogleAuthenticationFlow();

            if (createdSessionId && setActive) {
                await setActive({
                    session: createdSessionId,
                });

                // O index.tsx vai decidir para onde o usuário deve ir
                router.replace('/');
            }
        } catch (error: any) {
            console.log(
                'Erro ao entrar com Google:',
                JSON.stringify(error, null, 2)
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.conteudo}>
                    <Image
                        source={require('../../../assets/images/primeira_nota_logo2.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.titulo}>
                        Bem-vindo à Escola de Música{'\n'}
                        <Text style={styles.tituloAzul}>
                            Primeira Nota
                        </Text>
                    </Text>

                    <Text style={styles.subtitulo}>
                        Agende suas aulas de música de forma simples e rápida.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.botaoGoogle}
                        onPress={handleLoginGoogle}
                        disabled={carregando}
                        activeOpacity={0.85}
                    >
                        {carregando ? (
                            <ActivityIndicator
                                size="small"
                                color="#093373"
                            />
                        ) : (
                            <>
                                <Text style={styles.googleIcon}>
                                    G
                                </Text>

                                <Text style={styles.botaoGoogleTexto}>
                                    Entrar com Google
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.termos}>
                        Ao continuar, você concorda com os termos de uso
                        e a política de privacidade.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}