import { colors } from '../../theme/colors';

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

const FAIXAS_ETARIAS = [
    {
        label: 'Até 6 anos',
        value: 'ATE_6',
    },
    {
        label: '7 a 10 anos',
        value: 'DE_7_A_10',
    },
    {
        label: '11 a 14 anos',
        value: 'DE_11_A_14',
    },
    {
        label: '15 a 17 anos',
        value: 'DE_15_A_17',
    },
    {
        label: '18 anos ou mais',
        value: 'ADULTO',
    },
] as const;

type FaixaEtaria =
    (typeof FAIXAS_ETARIAS)[number]['value'];

export function CompleteScreen() {
    const { getToken, signOut } = useAuth();
    const router = useRouter();

    const {
        buscarEnderecoPorCep,
        buscando,
        erroCep,
    } = useBuscaCep();

    // =========================
    // ALUNO
    // =========================

    const [nomeAluno, setNomeAluno] = useState('');
    const [faixaEtaria, setFaixaEtaria] =
        useState<FaixaEtaria | ''>('');

    // =========================
    // CONTATO
    // =========================

    const [telefone, setTelefone] = useState('');

    // =========================
    // ENDEREÇO
    // =========================

    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] =
        useState('');

    // =========================
    // ESTADO DA TELA
    // =========================

    const [carregando, setCarregando] =
        useState(false);

    // Erro geral da tela/API
    const [erro, setErro] = useState('');

    // Erro específico do telefone
    const [erroTelefone, setErroTelefone] =
        useState('');

    // =========================
    // FORMATADORES
    // =========================

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

    // =========================
    // HANDLERS
    // =========================

    function limparErroGeral() {
        if (erro) {
            setErro('');
        }
    }

    function handleChangeTelefone(valor: string) {
        setTelefone(formatarTelefone(valor));

        if (erroTelefone) {
            setErroTelefone('');
        }

        limparErroGeral();
    }

    async function handleChangeCep(valor: string) {
        const formatado = formatarCep(valor);

        setCep(formatado);

        limparErroGeral();

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

    // =========================
    // SALVAR
    // =========================

    async function handleSalvar() {
        const telefoneNumeros =
            telefone.replace(/\D/g, '');

        const cepNumeros =
            cep.replace(/\D/g, '');

        // Limpa erros anteriores
        setErro('');
        setErroTelefone('');

        // =========================
        // VALIDAÇÃO DO ALUNO
        // =========================

        if (!nomeAluno.trim()) {
            setErro(
                'Digite o nome do aluno.'
            );
            return;
        }

        if (nomeAluno.trim().length < 2) {
            setErro(
                'Digite um nome de aluno válido.'
            );
            return;
        }

        if (!faixaEtaria) {
            setErro(
                'Selecione a faixa etária do aluno.'
            );
            return;
        }

        // =========================
        // VALIDAÇÃO DO TELEFONE
        // =========================

        if (
            telefoneNumeros.length < 10 ||
            telefoneNumeros.length > 11
        ) {
            setErroTelefone(
                'Digite um telefone válido com DDD'
            );
            return;
        }

        // =========================
        // VALIDAÇÃO DO ENDEREÇO
        // =========================

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
                        nomeAluno:
                            nomeAluno.trim(),

                        faixaEtaria,

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
                if (
                    typeof data?.error ===
                    'string' &&
                    data.error
                        .toLowerCase()
                        .includes('telefone')
                ) {
                    setErroTelefone(
                        data.error
                    );
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

    // =========================
    // VOLTAR PARA LOGIN
    // =========================

    async function handleVoltarLogin() {
        try {
            setCarregando(true);
            setErro('');
            setErroTelefone('');

            await signOut();

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
                {/* HEADER */}

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={
                            handleVoltarLogin
                        }
                        activeOpacity={0.7}
                        disabled={carregando}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={22}
                            color={colors.navy}
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
                    <View
                        style={styles.conteudo}
                    >
                        {/* TÍTULO */}

                        <Text
                            style={styles.titulo}
                        >
                            Falta pouco!
                            {'\n'}

                            <Text
                                style={
                                    styles.tituloAzul
                                }
                            >
                                Complete seu
                                cadastro
                            </Text>
                        </Text>

                        <Text
                            style={
                                styles.subtitulo
                            }
                        >
                            Precisamos de alguns
                            dados do aluno, contato
                            e endereço para agendar
                            suas aulas particulares.
                        </Text>

                        {/* ========================= */}
                        {/* ALUNO */}
                        {/* ========================= */}

                        <View
                            style={styles.card}
                        >
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
                                        name="account-music-outline"
                                        size={
                                            19
                                        }
                                        color={
                                            colors.navy
                                        }
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
                                        Aluno
                                    </Text>

                                    <Text
                                        style={
                                            styles.cardSubtitulo
                                        }
                                    >
                                        Quem vai
                                        fazer as
                                        aulas
                                    </Text>
                                </View>
                            </View>

                            {/* NOME */}

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
                                    Nome do aluno
                                </Text>

                                <View
                                    style={
                                        styles.inputWrapper
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="account-outline"
                                        size={
                                            18
                                        }
                                        color={
                                            colors.textSecondary
                                        }
                                        style={
                                            styles.inputIcone
                                        }
                                    />

                                    <TextInput
                                        style={
                                            styles.input
                                        }
                                        placeholder="Nome completo"
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        value={
                                            nomeAluno
                                        }
                                        onChangeText={(
                                            valor
                                        ) => {
                                            setNomeAluno(
                                                valor
                                            );

                                            limparErroGeral();
                                        }}
                                        editable={
                                            !carregando
                                        }
                                        autoCapitalize="words"
                                        autoCorrect={
                                            false
                                        }
                                        returnKeyType="next"
                                        maxLength={
                                            100
                                        }
                                    />
                                </View>
                            </View>

                            {/* FAIXA ETÁRIA */}

                            <View
                                style={
                                    styles.faixaEtariaContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Faixa etária
                                </Text>

                                <View
                                    style={
                                        styles.faixasContainer
                                    }
                                >
                                    {FAIXAS_ETARIAS.map(
                                        (
                                            faixa
                                        ) => {
                                            const selecionada =
                                                faixaEtaria ===
                                                faixa.value;

                                            return (
                                                <TouchableOpacity
                                                    key={
                                                        faixa.value
                                                    }
                                                    style={[
                                                        styles.faixaBotao,

                                                        selecionada
                                                            ? styles.faixaBotaoSelecionado
                                                            : null,
                                                    ]}
                                                    onPress={() => {
                                                        setFaixaEtaria(
                                                            faixa.value
                                                        );

                                                        limparErroGeral();
                                                    }}
                                                    disabled={
                                                        carregando
                                                    }
                                                    activeOpacity={
                                                        0.75
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.faixaTexto,

                                                            selecionada
                                                                ? styles.faixaTextoSelecionado
                                                                : null,
                                                        ]}
                                                    >
                                                        {
                                                            faixa.label
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* ========================= */}
                        {/* CONTATO */}
                        {/* ========================= */}

                        <View
                            style={styles.card}
                        >
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
                                        size={
                                            19
                                        }
                                        color={
                                            colors.navy
                                        }
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
                                        size={
                                            18
                                        }
                                        color={
                                            colors.textSecondary
                                        }
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
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        keyboardType="phone-pad"
                                        value={
                                            telefone
                                        }
                                        onChangeText={
                                            handleChangeTelefone
                                        }
                                        maxLength={
                                            15
                                        }
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

                        {/* ========================= */}
                        {/* ENDEREÇO */}
                        {/* ========================= */}

                        <View
                            style={styles.card}
                        >
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
                                        size={
                                            19
                                        }
                                        color={
                                            colors.navy
                                        }
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

                            {/* CEP */}

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
                                        size={
                                            18
                                        }
                                        color={
                                            colors.textSecondary
                                        }
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
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        keyboardType="numeric"
                                        value={
                                            cep
                                        }
                                        onChangeText={
                                            handleChangeCep
                                        }
                                        maxLength={
                                            9
                                        }
                                        editable={
                                            !carregando
                                        }
                                        returnKeyType="done"
                                    />

                                    {buscando && (
                                        <ActivityIndicator
                                            size="small"
                                            color={
                                                colors.navy
                                            }
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
                                        {
                                            erroCep
                                        }
                                    </Text>
                                ) : null}

                                {!!logradouro && (
                                    <>
                                        {/* ENDEREÇO */}

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
                                                    color={
                                                        colors.textSecondary
                                                    }
                                                    style={
                                                        styles.inputIcone
                                                    }
                                                />

                                                <TextInput
                                                    style={
                                                        styles.input
                                                    }
                                                    placeholder="Rua, avenida..."
                                                    placeholderTextColor={
                                                        colors.textMuted
                                                    }
                                                    value={
                                                        logradouro
                                                    }
                                                    onChangeText={(
                                                        valor
                                                    ) => {
                                                        setLogradouro(
                                                            valor
                                                        );

                                                        limparErroGeral();
                                                    }}
                                                    editable={
                                                        !carregando
                                                    }
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        {/* BAIRRO */}

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
                                                    color={
                                                        colors.textSecondary
                                                    }
                                                    style={
                                                        styles.inputIcone
                                                    }
                                                />

                                                <TextInput
                                                    style={
                                                        styles.input
                                                    }
                                                    placeholder="Bairro"
                                                    placeholderTextColor={
                                                        colors.textMuted
                                                    }
                                                    value={
                                                        bairro
                                                    }
                                                    onChangeText={(
                                                        valor
                                                    ) => {
                                                        setBairro(
                                                            valor
                                                        );

                                                        limparErroGeral();
                                                    }}
                                                    editable={
                                                        !carregando
                                                    }
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        {/* CIDADE / UF */}

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
                                                color={
                                                    colors.amberText
                                                }
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

                            {/* NÚMERO + COMPLEMENTO */}

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
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        keyboardType="numeric"
                                        value={
                                            numero
                                        }
                                        onChangeText={(
                                            valor
                                        ) => {
                                            setNumero(
                                                valor
                                            );

                                            limparErroGeral();
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
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
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
                                    color={
                                        colors.danger
                                    }
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

                    {/* FOOTER */}

                    <View
                        style={styles.footer}
                    >
                        <TouchableOpacity
                            style={[
                                styles.botaoContinuar,

                                carregando
                                    ? styles.botaoDesabilitado
                                    : null,
                            ]}
                            onPress={
                                handleSalvar
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
                                    color={
                                        colors.surface
                                    }
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
                                        size={
                                            20
                                        }
                                        color={
                                            colors.surface
                                        }
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