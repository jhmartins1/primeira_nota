import { colors } from '../../theme/colors';
import { useAuth } from '@clerk/expo';
import { useSignInWithGoogle } from '@clerk/expo/google';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './LoginScreen.styles';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

export function LoginScreen() {
    const {
        startGoogleAuthenticationFlow,
    } = useSignInWithGoogle();

    const { getToken } = useAuth();

    const router = useRouter();

    const [
        carregando,
        setCarregando,
    ] = useState(false);

    async function tentarVincularProfessor(
        token: string
    ) {
        try {
            const response =
                await fetch(
                    `${API_URL}/professor/vincular-conta`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            'Content-Type':
                                'application/json',
                        },
                    }
                );

            if (response.ok) {
                await response.json();
                return true;
            }

            if (
                response.status === 404
            ) {
                return false;
            }

            let mensagemErro =
                'Erro ao tentar vincular professor.';

            try {
                const data =
                    await response.json();

                if (data?.error) {
                    mensagemErro =
                        data.error;
                }
            } catch {
                // Ignora erro de parse
            }

            console.log(
                mensagemErro
            );

            return false;
        } catch (error) {
            console.log(
                'Erro ao vincular professor:',
                error
            );

            return false;
        }
    }

    async function handleLoginGoogle() {
        try {
            setCarregando(true);

            const {
                createdSessionId,
                setActive,
            } =
                await startGoogleAuthenticationFlow();

            if (!createdSessionId) {
                throw new Error(
                    'Não foi possível criar a sessão do usuário.'
                );
            }

            if (!setActive) {
                throw new Error(
                    'Não foi possível ativar a sessão do usuário.'
                );
            }

            await setActive({
                session:
                    createdSessionId,
            });

            const token =
                await getToken();

            if (!token) {
                throw new Error(
                    'Não foi possível obter o token da sessão.'
                );
            }

            await tentarVincularProfessor(
                token
            );

            router.replace('/');
        } catch (error: any) {
            console.log(
                'Erro ao entrar com Google:',
                error
            );

            const mensagem =
                error?.message ??
                error?.errors?.[0]
                    ?.message ??
                error?.code ??
                'Não foi possível entrar com o Google.';

            Alert.alert(
                'Erro ao entrar',
                String(mensagem)
            );
        } finally {
            setCarregando(false);
        }
    }

    async function abrirInstagram() {
        try {
            await Linking.openURL(
                'https://www.instagram.com/jh.martins1/'
            );
        } catch (error) {
            console.log(
                'Erro ao abrir Instagram:',
                error
            );
        }
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* ELEMENTOS DECORATIVOS */}

                <View
                    style={
                        styles.circuloDecorativoGrande
                    }
                />

                <View
                    style={
                        styles.circuloDecorativoPequeno
                    }
                />

                <MaterialCommunityIcons
                    name="music-note"
                    size={38}
                    color={colors.orange}
                    style={
                        styles.notaMusicalUm
                    }
                />

                <MaterialCommunityIcons
                    name="music-note-eighth-dotted"
                    size={32}
                    color={colors.turquoise}
                    style={
                        styles.notaMusicalDois
                    }
                />

                <MaterialCommunityIcons
                    name="music-clef-treble"
                    size={72}
                    color={colors.tealSoft}
                    style={
                        styles.claveMusical
                    }
                />

                {/* HERO */}

                <View
                    style={styles.hero}
                >
                    <View
                        style={
                            styles.logoContainer
                        }
                    >
                        <Image
                            source={require('../../../assets/images/tocae_logo.png')}
                            style={
                                styles.logo
                            }
                            resizeMode="contain"
                        />
                    </View>

                    <Text
                        style={
                            styles.titulo
                        }
                    >
                        Sua música começa
                    </Text>

                    <Text
                        style={
                            styles.tituloDestaque
                        }
                    >
                        no Tocaê
                    </Text>

                    <Text
                        style={
                            styles.subtitulo
                        }
                    >
                        Encontre seu
                        professor, escolha
                        seu instrumento e
                        agende sua próxima
                        aula.
                    </Text>

                    {/* ÍCONES DOS INSTRUMENTOS */}

                    <View
                        style={
                            styles.instrumentos
                        }
                    >
                        <View
                            style={
                                [styles.instrumento, { backgroundColor: colors.yellowSoft, borderColor: colors.yellowBorder }]
                            }
                        >
                            <MaterialCommunityIcons
                                name="guitar-acoustic"
                                size={20}
                                color={colors.amberText}
                            />
                        </View>

                        <View
                            style={
                                styles.instrumento
                            }
                        >
                            <MaterialCommunityIcons
                                name="piano"
                                size={20}
                                color={colors.teal}
                            />
                        </View>

                        <View
                            style={
                                [styles.instrumento, { backgroundColor: colors.orangeSoft, borderColor: colors.orangeSoft }]
                            }
                        >
                            <MaterialCommunityIcons
                                name="music-note"
                                size={20}
                                color={colors.orangeText}
                            />
                        </View>

                        <View
                            style={
                                [styles.instrumento, { backgroundColor: colors.navy, borderColor: colors.navy }]
                            }
                        >
                            <MaterialCommunityIcons
                                name="microphone-variant"
                                size={20}
                                color={colors.surface}
                            />
                        </View>
                    </View>
                </View>

                {/* CARD LOGIN */}

                <View
                    style={
                        styles.loginCard
                    }
                >
                    <View
                        style={
                            styles.indicador
                        }
                    />

                    <Text
                        style={
                            styles.loginTitulo
                        }
                    >
                        Vamos começar?
                    </Text>

                    <Text
                        style={
                            styles.loginSubtitulo
                        }
                    >
                        Entre para acessar
                        sua conta e continuar
                        sua jornada musical.
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.botaoGoogle,
                            carregando &&
                            styles.botaoDesabilitado,
                        ]}
                        onPress={
                            handleLoginGoogle
                        }
                        disabled={
                            carregando
                        }
                        activeOpacity={
                            0.85
                        }
                    >
                        {carregando ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.navy}
                            />
                        ) : (
                            <>
                                <View
                                    style={
                                        styles.googleIconContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.googleIcon
                                        }
                                    >
                                        G
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.botaoGoogleTexto
                                    }
                                >
                                    Continuar
                                    com Google
                                </Text>

                                <MaterialCommunityIcons
                                    name="arrow-right"
                                    size={20}
                                    color={colors.navy}
                                    style={
                                        styles.setaGoogle
                                    }
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* TERMOS */}

                    <View
                        style={
                            styles.linhaTermos
                        }
                    >
                        <MaterialCommunityIcons
                            name="shield-check-outline"
                            size={15}
                            color="#CEDDEC"
                        />

                        <Text
                            style={
                                styles.termos
                            }
                        >
                            Ao continuar, você
                            concorda com os
                            termos de uso e a
                            política de
                            privacidade.
                        </Text>
                    </View>

                    {/* ASSINATURA DO DEV */}

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={
                            abrirInstagram
                        }
                        style={
                            styles.madeByContainer
                        }
                    >
                        <Text
                            style={
                                styles.madeByTexto
                            }
                        >
                            Made by{' '}

                            <Text
                                style={
                                    styles.madeByNick
                                }
                            >
                                0xJHM
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
