import { useAuth } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './ProfileScreen.styles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
    const router = useRouter();
    const { getToken } = useAuth();

    const [telefone, setTelefone] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    function formatarTelefone(valor: string) {
        const somenteNumeros = valor
            .replace(/\D/g, '')
            .slice(0, 11);

        if (somenteNumeros.length <= 2) {
            return somenteNumeros;
        }

        if (somenteNumeros.length <= 7) {
            return `(${somenteNumeros.slice(
                0,
                2
            )}) ${somenteNumeros.slice(2)}`;
        }

        return `(${somenteNumeros.slice(
            0,
            2
        )}) ${somenteNumeros.slice(2, 7)}-${somenteNumeros.slice(7)}`;
    }

    async function carregarPerfil() {
        try {
            setCarregando(true);
            setErro('');

            if (!API_URL) {
                setErro('API não configurada.');
                return;
            }

            const token = await getToken();

            if (!token) {
                setErro('Não foi possível autenticar o usuário.');
                return;
            }

            const response = await fetch(`${API_URL}/usuario/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(
                    data.error ??
                    'Não foi possível carregar seu perfil.'
                );
                return;
            }

            if (data.phone) {
                setTelefone(formatarTelefone(data.phone));
            }
        } catch (error) {
            console.log(
                'Erro ao carregar perfil:',
                JSON.stringify(error, null, 2)
            );

            setErro(
                'Não foi possível carregar seus dados. Tente novamente.'
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarPerfil();
    }, []);

    function handleChangeTelefone(valor: string) {
        setTelefone(formatarTelefone(valor));

        if (erro) {
            setErro('');
        }

        if (sucesso) {
            setSucesso('');
        }
    }

    async function handleSalvar() {
        const somenteNumeros = telefone.replace(/\D/g, '');

        if (somenteNumeros.length < 10) {
            setErro('Digite um telefone válido com DDD.');
            return;
        }

        try {
            setSalvando(true);
            setErro('');
            setSucesso('');

            if (!API_URL) {
                setErro('API não configurada.');
                return;
            }

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
                setErro(
                    data.error ??
                    'Não foi possível atualizar seu telefone.'
                );
                return;
            }

            setTelefone(formatarTelefone(data.phone));

            setSucesso('Telefone atualizado com sucesso!');
        } catch (error) {
            console.log(
                'Erro ao atualizar telefone:',
                JSON.stringify(error, null, 2)
            );

            setErro('Ocorreu um erro. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text style={styles.loadingTexto}>
                        Carregando seu perfil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        activeOpacity={0.7}
                        onPress={() => router.back()}
                        disabled={salvando}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={22}
                            color="#093373"
                        />

                        <Text style={styles.textoVoltar}>
                            Voltar
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={
                        styles.scrollContent
                    }
                >
                    {/* TÍTULO */}

                    <View style={styles.tituloContainer}>
                        <View style={styles.iconePerfil}>
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={32}
                                color="#093373"
                            />
                        </View>

                        <Text style={styles.titulo}>
                            Meu perfil
                        </Text>

                        <Text style={styles.subtitulo}>
                            Atualize seus dados de contato.
                        </Text>
                    </View>

                    {/* CARD */}

                    <View style={styles.card}>
                        <View style={styles.campoHeader}>
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={21}
                                color="#093373"
                            />

                            <Text style={styles.campoTitulo}>
                                Telefone
                            </Text>
                        </View>

                        <Text style={styles.label}>
                            Número de telefone
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                erro
                                    ? styles.inputErro
                                    : null,
                            ]}
                            placeholder="(61) 98235-1199"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            value={telefone}
                            onChangeText={
                                handleChangeTelefone
                            }
                            maxLength={15}
                            editable={!salvando}
                            returnKeyType="done"
                        />

                        {erro ? (
                            <View style={styles.mensagemErro}>
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#B42318"
                                />

                                <Text style={styles.textoErro}>
                                    {erro}
                                </Text>
                            </View>
                        ) : null}

                        {sucesso ? (
                            <View style={styles.mensagemSucesso}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={16}
                                    color="#2E8B57"
                                />

                                <Text
                                    style={
                                        styles.textoSucesso
                                    }
                                >
                                    {sucesso}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {/* INFORMAÇÃO */}

                    <View style={styles.infoCard}>
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={20}
                            color="#093373"
                        />

                        <Text style={styles.infoTexto}>
                            Seu telefone é utilizado para
                            avisos importantes sobre suas
                            aulas e agendamentos.
                        </Text>
                    </View>
                </ScrollView>

                {/* BOTÃO SALVAR */}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.botaoSalvar,
                            salvando &&
                            styles.botaoSalvarDesabilitado,
                        ]}
                        activeOpacity={0.85}
                        onPress={handleSalvar}
                        disabled={salvando}
                    >
                        {salvando ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <>
                                <Text
                                    style={
                                        styles.botaoSalvarTexto
                                    }
                                >
                                    Salvar alterações
                                </Text>

                                <MaterialCommunityIcons
                                    name="check"
                                    size={20}
                                    color="#FFFFFF"
                                />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

