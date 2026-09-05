import { useSignInWithGoogle } from '@clerk/expo/google';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { useState } from 'react';

import {
    ActivityIndicator,
    Image,
    Linking,
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

    const [carregando, setCarregando] =
        useState(false);

    async function handleLoginGoogle() {
        try {
            setCarregando(true);

            const {
                createdSessionId,
                setActive,
            } =
                await startGoogleAuthenticationFlow();

            if (
                createdSessionId &&
                setActive
            ) {
                await setActive({
                    session:
                        createdSessionId,
                });

                // O index.tsx vai decidir
                // para onde o usuário deve ir
                router.replace('/');
            }
        } catch (error: any) {
            console.log(
                'Erro ao entrar com Google:',
                JSON.stringify(
                    error,
                    null,
                    2
                )
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
            <View
                style={styles.container}
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
                    color="rgba(255,255,255,0.18)"
                    style={
                        styles.notaMusicalUm
                    }
                />

                <MaterialCommunityIcons
                    name="music-note-eighth-dotted"
                    size={32}
                    color="rgba(255,255,255,0.14)"
                    style={
                        styles.notaMusicalDois
                    }
                />

                <MaterialCommunityIcons
                    name="music-clef-treble"
                    size={72}
                    color="rgba(255,255,255,0.08)"
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
                            source={require('../../../assets/images/primeira_nota_logo2.png')}
                            style={
                                styles.logo
                            }
                            resizeMode="contain"
                        />
                    </View>

                    <Text
                        style={styles.titulo}
                    >
                        Sua música começa
                    </Text>

                    <Text
                        style={
                            styles.tituloDestaque
                        }
                    >
                        na Primeira Nota
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
                                styles.instrumento
                            }
                        >
                            <MaterialCommunityIcons
                                name="guitar-acoustic"
                                size={20}
                                color="#FFFFFF"
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
                                color="#FFFFFF"
                            />
                        </View>

                        <View
                            style={
                                styles.instrumento
                            }
                        >
                            <MaterialCommunityIcons
                                name="music-note"
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>

                        <View
                            style={
                                styles.instrumento
                            }
                        >
                            <MaterialCommunityIcons
                                name="microphone-variant"
                                size={20}
                                color="#FFFFFF"
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
                                color="#093373"
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
                                    Continuar com
                                    Google
                                </Text>

                                <MaterialCommunityIcons
                                    name="arrow-right"
                                    size={20}
                                    color="#093373"
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
                            color="#9CA3AF"
                        />

                        <Text
                            style={
                                styles.termos
                            }
                        >
                            Ao continuar,
                            você concorda
                            com os termos de
                            uso e a política
                            de privacidade.
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
            </View>
        </SafeAreaView>
    );
}