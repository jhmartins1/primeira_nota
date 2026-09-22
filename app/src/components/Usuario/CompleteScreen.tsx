import { useAuth } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

import { useBuscaCep } from '../../hooks/useBuscaCep';
import { styles } from './CompleteScreen.styles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function CompleteScreen() {
    const { getToken, signOut } = useAuth();
    const router = useRouter();

    const {
        buscarEnderecoPorCep,
        buscando,
        erroCep,
    } = useBuscaCep();

    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    const [carregando, setCarregando] = useState(false);

    // Erro geral da tela/API
    const [erro, setErro] = useState('');

    // Erro específico do telefone
    const [erroTelefone, setErroTelefone] = useState('');

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
        )}) ${somenteNumeros.slice(
            2,
            7
        )}-${somenteNumeros.slice(7)}`;
    }

    function formatarCep(valor: string) {
        const somenteNumeros = valor
            .replace(/\D/g, '')
            .slice(0, 8);

        if (somenteNumeros.length <= 5) {
            return somenteNumeros;
        }

        return `${somenteNumeros.slice(
            0,
            5
        )}-${somenteNumeros.slice(5)}`;
    }

    function handleChangeTelefone(valor: string) {
        setTelefone(formatarTelefone(valor));

        if (erroTelefone) {
            setErroTelefone('');
        }

        if (erro) {
            setErro('');
        }
    }

    async function handleChangeCep(valor: string) {
        const formatado = formatarCep(valor);

        setCep(formatado);

        if (erro) {
            setErro('');
        }

        const somenteNumeros =
            formatado.replace(/\D/g, '');

        if (somenteNumeros.length === 8) {
            const endereco =
                await buscarEnderecoPorCep(
                    formatado
                );

            if (endereco) {
                setLogradouro(
                    endereco.logradouro
                );
                setBairro(endereco.bairro);
                setCidade(endereco.localidade);
                setUf(endereco.uf);
            }
        }
    }

    async function handleSalvar() {
        const telefoneNumeros =
            telefone.replace(/\D/g, '');

        const cepNumeros =
            cep.replace(/\D/g, '');

        // Limpa erros anteriores
        setErro('');
        setErroTelefone('');

        if (
            telefoneNumeros.length < 10 ||
            telefoneNumeros.length > 11
        ) {
            setErroTelefone(
                'Digite um telefone válido com DDD'
            );
            return;
        }

        if (cepNumeros.length !== 8) {
            setErro('Digite um CEP válido');
            return;
        }

        if (!numero.trim()) {
            setErro(
                'Digite o número da residência'
            );
            return;
        }

        if (!logradouro.trim()) {
            setErro('Digite o endereço.');
            return;
        }

        if (!bairro.trim()) {
            setErro('Digite o bairro.');
            return;
        }

        if (!cidade || !uf) {
            setErro(
                'Não foi possível confirmar a cidade e o estado pelo CEP.'
            );
            return;
        }

        try {
            setCarregando(true);
            setErro('');

            const token = await getToken();

            if (!token) {
                setErro(
                    'Não foi possível autenticar o usuário.'
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/usuario/me`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        phone: telefoneNumeros,
                        cep: cepNumeros,
                        logradouro:
                            logradouro.trim(),
                        numero: numero.trim(),
                        complemento:
                            complemento.trim() ||
                            undefined,
                        bairro: bairro.trim(),
                        cidade: cidade.trim(),
                        uf: uf.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // Se o próprio backend disser que
                // o telefone é inválido, marca
                // especificamente o campo.
                if (
                    typeof data?.error ===
                    'string' &&
                    data.error
                        .toLowerCase()
                        .includes('telefone')
                ) {
                    setErroTelefone(data.error);
                    return;
                }

                setErro(
                    data?.error ??
                    'Não foi possível salvar seus dados'
                );

                return;
            }

            router.replace('/');
        } catch (error) {
            console.log(
                'Erro ao salvar perfil:',
                error
            );

            setErro(
                'Ocorreu um erro. Tente novamente.'
            );
        } finally {
            setCarregando(false);
        }
    }

    async function handleVoltarLogin() {
        try {
            setCarregando(true);
            setErro('');
            setErroTelefone('');

            // Encerra de verdade a sessão do Clerk.
            await signOut();

            // Agora o guard não considera mais
            // o usuário autenticado.
            router.replace('/login');
        } catch (error) {
            console.log(
                'Erro ao sair da conta:',
                error
            );

            setErro(
                'Não foi possível sair da conta. Tente novamente.'
            );
        } finally {
            setCarregando(false);
        }
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
                keyboardVerticalOffset={
                    Platform.OS === 'ios'
                        ? 0
                        : 20
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={handleVoltarLogin}
                        activeOpacity={0.7}
                        disabled={carregando}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={22}
                            color="#093373"
                        />

                        <Text
                            style={
                                styles.textoVoltar
                            }
                        >
                            Voltar para o Login
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <View style={styles.conteudo}>
                        <Text style={styles.titulo}>
                            Falta pouco!
                            {'\n'}

                            <Text
                                style={
                                    styles.tituloAzul
                                }
                            >
                                Complete seu cadastro
                            </Text>
                        </Text>

                        <Text
                            style={styles.subtitulo}
                        >
                            Precisamos do seu
                            telefone e endereço para
                            agendar suas aulas
                            particulares.
                        </Text>

                        {/* CONTATO */}

                        <View style={styles.card}>
                            <View
                                style={
                                    styles.cardHeader
                                }
                            >
                                <View
                                    style={
                                        styles.cardIcone
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="phone-outline"
                                        size={19}
                                        color="#093373"
                                    />
                                </View>

                                <View
                                    style={
                                        styles.cardTituloContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.cardTitulo
                                        }
                                    >
                                        Contato
                                    </Text>

                                    <Text
                                        style={
                                            styles.cardSubtitulo
                                        }
                                    >
                                        Para avisar
                                        sobre suas
                                        aulas
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.inputContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Telefone
                                </Text>

                                <View
                                    style={
                                        styles.inputWrapper
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="cellphone"
                                        size={18}
                                        color="#6B7280"
                                        style={
                                            styles.inputIcone
                                        }
                                    />

                                    <TextInput
                                        style={[
                                            styles.input,
                                            erroTelefone
                                                ? styles.inputErro
                                                : null,
                                        ]}
                                        placeholder="(61) 98235-1199"
                                        placeholderTextColor="#999"
                                        keyboardType="phone-pad"
                                        value={
                                            telefone
                                        }
                                        onChangeText={
                                            handleChangeTelefone
                                        }
                                        maxLength={15}
                                        editable={
                                            !carregando
                                        }
                                        returnKeyType="done"
                                    />
                                </View>

                                {erroTelefone ? (
                                    <Text
                                        style={
                                            styles.textoErroCampo
                                        }
                                    >
                                        {
                                            erroTelefone
                                        }
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {/* ENDEREÇO */}

                        <View style={styles.card}>
                            <View
                                style={
                                    styles.cardHeader
                                }
                            >
                                <View
                                    style={
                                        styles.cardIcone
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="home-city-outline"
                                        size={19}
                                        color="#093373"
                                    />
                                </View>

                                <View
                                    style={
                                        styles.cardTituloContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.cardTitulo
                                        }
                                    >
                                        Endereço
                                    </Text>

                                    <Text
                                        style={
                                            styles.cardSubtitulo
                                        }
                                    >
                                        Onde as aulas
                                        vão acontecer
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.inputContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    CEP
                                </Text>

                                <View
                                    style={
                                        styles.inputWrapper
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="map-marker-outline"
                                        size={18}
                                        color="#6B7280"
                                        style={
                                            styles.inputIcone
                                        }
                                    />

                                    <TextInput
                                        style={[
                                            styles.input,
                                            erroCep
                                                ? styles.inputErro
                                                : null,
                                        ]}
                                        placeholder="00000-000"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={cep}
                                        onChangeText={
                                            handleChangeCep
                                        }
                                        maxLength={9}
                                        editable={
                                            !carregando
                                        }
                                        returnKeyType="done"
                                    />

                                    {buscando && (
                                        <ActivityIndicator
                                            size="small"
                                            color="#093373"
                                            style={
                                                styles.inputLoading
                                            }
                                        />
                                    )}
                                </View>

                                {erroCep ? (
                                    <Text
                                        style={
                                            styles.textoErroCampo
                                        }
                                    >
                                        {erroCep}
                                    </Text>
                                ) : null}

                                {!!logradouro && (
                                    <>
                                        <View
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    marginTop: 14,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={
                                                    styles.label
                                                }
                                            >
                                                Endereço
                                            </Text>

                                            <View
                                                style={
                                                    styles.inputWrapper
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="road-variant"
                                                    size={
                                                        18
                                                    }
                                                    color="#6B7280"
                                                    style={
                                                        styles.inputIcone
                                                    }
                                                />

                                                <TextInput
                                                    style={
                                                        styles.input
                                                    }
                                                    placeholder="Rua, avenida..."
                                                    placeholderTextColor="#999"
                                                    value={
                                                        logradouro
                                                    }
                                                    onChangeText={(
                                                        valor
                                                    ) => {
                                                        setLogradouro(
                                                            valor
                                                        );

                                                        if (
                                                            erro
                                                        ) {
                                                            setErro(
                                                                ''
                                                            );
                                                        }
                                                    }}
                                                    editable={
                                                        !carregando
                                                    }
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    marginTop: 14,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={
                                                    styles.label
                                                }
                                            >
                                                Bairro
                                            </Text>

                                            <View
                                                style={
                                                    styles.inputWrapper
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="map-marker-radius-outline"
                                                    size={
                                                        18
                                                    }
                                                    color="#6B7280"
                                                    style={
                                                        styles.inputIcone
                                                    }
                                                />

                                                <TextInput
                                                    style={
                                                        styles.input
                                                    }
                                                    placeholder="Bairro"
                                                    placeholderTextColor="#999"
                                                    value={
                                                        bairro
                                                    }
                                                    onChangeText={(
                                                        valor
                                                    ) => {
                                                        setBairro(
                                                            valor
                                                        );

                                                        if (
                                                            erro
                                                        ) {
                                                            setErro(
                                                                ''
                                                            );
                                                        }
                                                    }}
                                                    editable={
                                                        !carregando
                                                    }
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View
                                            style={
                                                styles.enderecoPreview
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name="map-marker-check-outline"
                                                size={
                                                    16
                                                }
                                                color="#8A661F"
                                            />

                                            <Text
                                                style={
                                                    styles.enderecoPreviewTexto
                                                }
                                            >
                                                {
                                                    cidade
                                                }
                                                /
                                                {uf}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            <View
                                style={
                                    styles.linhaDupla
                                }
                            >
                                <View
                                    style={[
                                        styles.inputContainer,
                                        styles.inputMetade,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.label
                                        }
                                    >
                                        Número
                                    </Text>

                                    <TextInput
                                        style={
                                            styles.input
                                        }
                                        placeholder="123"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={numero}
                                        onChangeText={(
                                            valor
                                        ) => {
                                            setNumero(
                                                valor
                                            );

                                            if (erro) {
                                                setErro(
                                                    ''
                                                );
                                            }
                                        }}
                                        editable={
                                            !carregando
                                        }
                                        returnKeyType="done"
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.inputContainer,
                                        styles.inputMetade,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.label
                                        }
                                    >
                                        Complemento{' '}

                                        <Text
                                            style={
                                                styles.labelOpcional
                                            }
                                        >
                                            (opcional)
                                        </Text>
                                    </Text>

                                    <TextInput
                                        style={
                                            styles.input
                                        }
                                        placeholder="Apto 12, bloco B"
                                        placeholderTextColor="#999"
                                        value={
                                            complemento
                                        }
                                        onChangeText={
                                            setComplemento
                                        }
                                        editable={
                                            !carregando
                                        }
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* ERRO GERAL */}

                        {erro ? (
                            <View
                                style={
                                    styles.bannerErro
                                }
                            >
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={18}
                                    color="#B42318"
                                />

                                <Text
                                    style={
                                        styles.bannerErroTexto
                                    }
                                >
                                    {erro}
                                </Text>
                            </View>
                        ) : null}
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
                                <>
                                    <Text
                                        style={
                                            styles.botaoContinuarTexto
                                        }
                                    >
                                        Continuar
                                    </Text>

                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}