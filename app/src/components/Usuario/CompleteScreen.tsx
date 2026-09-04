import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './CompleteScreen.styles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function CompleteScreen() {
    const { getToken } = useAuth();
    const router = useRouter();

    const [telefone, setTelefone] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    function formatarTelefone(valor: string) {
        const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);

        if (somenteNumeros.length <= 2) {
            return somenteNumeros;
        }

        if (somenteNumeros.length <= 7) {
            return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2)}`;
        }

        return `(${somenteNumeros.slice(
            0,
            2
        )}) ${somenteNumeros.slice(2, 7)}-${somenteNumeros.slice(7)}`;
    }

    function handleChangeTelefone(valor: string) {
        setTelefone(formatarTelefone(valor));

        if (erro) {
            setErro('');
        }
    }

    async function handleSalvar() {
        const somenteNumeros = telefone.replace(/\D/g, '');

        if (somenteNumeros.length < 10) {
            setErro('Digite um telefone válido com DDD');
            return;
        }

        try {
            setCarregando(true);
            setErro('');

            const token = await getToken();

            if (!token) {
                setErro('Não foi possível autenticar o usuário.');
                return;
            }

            const response = await fetch(`${API_URL}/usuario/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    phone: somenteNumeros,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.error ?? 'Não foi possível salvar seu telefone');
                return;
            }

            router.replace('/');
        } catch (error) {
            console.log(
                'Erro ao salvar telefone:',
                JSON.stringify(error, null, 2)
            );
            setErro('Ocorreu um erro. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    function handleVoltarLogin() {
        router.replace('/login');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={handleVoltarLogin}
                        activeOpacity={0.7}
                        disabled={carregando}
                    >
                        <Text style={styles.seta}>‹</Text>
                        <Text style={styles.textoVoltar}>
                            Voltar para o Login
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.conteudo}>
                        <Image
                            source={require('../../../assets/images/primeira_nota_logo2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.titulo}>
                            Falta pouco!{'\n'}
                            <Text style={styles.tituloAzul}>
                                Complete seu cadastro
                            </Text>
                        </Text>

                        <Text style={styles.subtitulo}>
                            Precisamos do seu telefone para te avisar sobre
                            suas aulas agendadas.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Telefone</Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    erro ? styles.inputErro : null,
                                ]}
                                placeholder="(61) 98235-1199"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={telefone}
                                onChangeText={handleChangeTelefone}
                                maxLength={15}
                                editable={!carregando}
                                returnKeyType="done"
                            />

                            {erro ? (
                                <Text style={styles.textoErro}>{erro}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.botaoContinuar,
                                carregando
                                    ? styles.botaoDesabilitado
                                    : null,
                            ]}
                            onPress={handleSalvar}
                            disabled={carregando}
                            activeOpacity={0.85}
                        >
                            {carregando ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                />
                            ) : (
                                <Text style={styles.botaoContinuarTexto}>
                                    Continuar
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

