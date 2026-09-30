import { colors } from '../../theme/colors';

import { useAuth } from '@clerk/expo';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import {
    useEffect,
    useState,
} from 'react';

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

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useBuscaCep,
} from '../../hooks/useBuscaCep';

import {
    styles,
} from './ProfileScreen.styles';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

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

export default function ProfileScreen() {
    const router = useRouter();

    const {
        getToken,
    } = useAuth();

    const {
        buscarEnderecoPorCep,
        buscando,
        erroCep,
    } = useBuscaCep();

    // =========================
    // DADOS DO ALUNO
    // =========================

    const [
        nomeAluno,
        setNomeAluno,
    ] = useState('');

    const [
        faixaEtaria,
        setFaixaEtaria,
    ] = useState<FaixaEtaria | ''>('');

    // =========================
    // CONTATO
    // =========================

    const [
        telefone,
        setTelefone,
    ] = useState('');

    // =========================
    // ENDEREÇO
    // =========================

    const [
        cep,
        setCep,
    ] = useState('');

    const [
        logradouro,
        setLogradouro,
    ] = useState('');

    const [
        bairro,
        setBairro,
    ] = useState('');

    const [
        cidade,
        setCidade,
    ] = useState('');

    const [
        uf,
        setUf,
    ] = useState('');

    const [
        numero,
        setNumero,
    ] = useState('');

    const [
        complemento,
        setComplemento,
    ] = useState('');

    // =========================
    // ESTADOS DA TELA
    // =========================

    const [
        carregando,
        setCarregando,
    ] = useState(true);

    const [
        salvando,
        setSalvando,
    ] = useState(false);

    const [
        erro,
        setErro,
    ] = useState('');

    const [
        sucesso,
        setSucesso,
    ] = useState('');

    // =========================
    // FORMATAÇÃO
    // =========================

    function formatarTelefone(
        valor: string
    ) {
        const somenteNumeros =
            valor
                .replace(/\D/g, '')
                .slice(0, 11);

        if (
            somenteNumeros.length <= 2
        ) {
            return somenteNumeros;
        }

        if (
            somenteNumeros.length <= 7
        ) {
            return `(${somenteNumeros.slice(
                0,
                2
            )}) ${somenteNumeros.slice(
                2
            )}`;
        }

        return `(${somenteNumeros.slice(
            0,
            2
        )}) ${somenteNumeros.slice(
            2,
            7
        )}-${somenteNumeros.slice(7)}`;
    }

    function formatarCep(
        valor: string
    ) {
        const somenteNumeros =
            valor
                .replace(/\D/g, '')
                .slice(0, 8);

        if (
            somenteNumeros.length <= 5
        ) {
            return somenteNumeros;
        }

        return `${somenteNumeros.slice(
            0,
            5
        )}-${somenteNumeros.slice(5)}`;
    }

    // =========================
    // CARREGAR PERFIL
    // =========================

    async function carregarPerfil() {
        try {
            setCarregando(true);
            setErro('');

            if (!API_URL) {
                setErro(
                    'API não configurada.'
                );

                return;
            }

            const token =
                await getToken();

            if (!token) {
                setErro(
                    'Não foi possível autenticar o usuário.'
                );

                return;
            }

            const response =
                await fetch(
                    `${API_URL}/usuario/me`,
                    {
                        method: 'GET',

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                setErro(
                    data.error ??
                    'Não foi possível carregar seu perfil.'
                );

                return;
            }

            // DADOS DO ALUNO

            setNomeAluno(
                data.nomeAluno ?? ''
            );

            setFaixaEtaria(
                data.faixaEtaria ?? ''
            );

            // TELEFONE

            setTelefone(
                data.phone
                    ? formatarTelefone(
                        data.phone
                    )
                    : ''
            );

            // ENDEREÇO

            setCep(
                data.cep
                    ? formatarCep(
                        data.cep
                    )
                    : ''
            );

            setLogradouro(
                data.logradouro ?? ''
            );

            setNumero(
                data.numero ?? ''
            );

            setComplemento(
                data.complemento ?? ''
            );

            setBairro(
                data.bairro ?? ''
            );

            setCidade(
                data.cidade ?? ''
            );

            setUf(
                data.uf ?? ''
            );
        } catch (error) {
            console.log(
                'Erro ao carregar perfil:',
                JSON.stringify(
                    error,
                    null,
                    2
                )
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

    // =========================
    // LIMPAR MENSAGENS
    // =========================

    function limparMensagens() {
        if (erro) {
            setErro('');
        }

        if (sucesso) {
            setSucesso('');
        }
    }

    // =========================
    // TELEFONE
    // =========================

    function handleChangeTelefone(
        valor: string
    ) {
        setTelefone(
            formatarTelefone(valor)
        );

        limparMensagens();
    }

    // =========================
    // CEP
    // =========================

    async function handleChangeCep(
        valor: string
    ) {
        const formatado =
            formatarCep(valor);

        setCep(formatado);

        limparMensagens();

        const somenteNumeros =
            formatado.replace(
                /\D/g,
                ''
            );

        if (
            somenteNumeros.length !== 8
        ) {
            return;
        }

        const endereco =
            await buscarEnderecoPorCep(
                formatado
            );

        if (!endereco) {
            return;
        }

        setLogradouro(
            endereco.logradouro
        );

        setBairro(
            endereco.bairro
        );

        setCidade(
            endereco.localidade
        );

        setUf(
            endereco.uf
        );

        // Se o usuário trocar o CEP,
        // provavelmente é outro endereço.
        setNumero('');
        setComplemento('');
    }

    // =========================
    // SALVAR PERFIL
    // =========================

    async function handleSalvar() {
        const telefoneNumeros =
            telefone.replace(
                /\D/g,
                ''
            );

        const cepNumeros =
            cep.replace(
                /\D/g,
                ''
            );

        // NOME DO ALUNO

        if (!nomeAluno.trim()) {
            setErro(
                'Digite o nome do aluno.'
            );

            return;
        }

        if (
            nomeAluno.trim().length < 2
        ) {
            setErro(
                'Digite um nome de aluno válido.'
            );

            return;
        }

        // FAIXA ETÁRIA

        if (!faixaEtaria) {
            setErro(
                'Selecione a faixa etária do aluno.'
            );

            return;
        }

        // TELEFONE

        if (
            telefoneNumeros.length < 10
        ) {
            setErro(
                'Digite um telefone válido com DDD.'
            );

            return;
        }

        // CEP

        if (
            cepNumeros.length !== 8
        ) {
            setErro(
                'Digite um CEP válido.'
            );

            return;
        }

        // ENDEREÇO

        if (!logradouro.trim()) {
            setErro(
                'Digite o endereço.'
            );

            return;
        }

        if (!bairro.trim()) {
            setErro(
                'Digite o bairro.'
            );

            return;
        }

        if (
            !cidade ||
            !uf
        ) {
            setErro(
                'Não foi possível confirmar a cidade e o estado pelo CEP.'
            );

            return;
        }

        if (!numero.trim()) {
            setErro(
                'Digite o número da residência.'
            );

            return;
        }

        try {
            setSalvando(true);

            setErro('');
            setSucesso('');

            if (!API_URL) {
                setErro(
                    'API não configurada.'
                );

                return;
            }

            const token =
                await getToken();

            if (!token) {
                setErro(
                    'Não foi possível autenticar o usuário.'
                );

                return;
            }

            const response =
                await fetch(
                    `${API_URL}/usuario/me`,
                    {
                        method:
                            'PATCH',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify(
                                {
                                    nomeAluno:
                                        nomeAluno.trim(),

                                    faixaEtaria,

                                    phone:
                                        telefoneNumeros,

                                    cep:
                                        cepNumeros,

                                    logradouro:
                                        logradouro.trim(),

                                    numero:
                                        numero.trim(),

                                    complemento:
                                        complemento.trim() ||
                                        undefined,

                                    bairro:
                                        bairro.trim(),

                                    cidade:
                                        cidade.trim(),

                                    uf:
                                        uf
                                            .trim()
                                            .toUpperCase(),
                                }
                            ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                setErro(
                    data.error ??
                    'Não foi possível atualizar seus dados.'
                );

                return;
            }

            // =========================
            // ATUALIZA ESTADO LOCAL
            // =========================

            setNomeAluno(
                data.nomeAluno ??
                nomeAluno
            );

            setFaixaEtaria(
                data.faixaEtaria ??
                faixaEtaria
            );

            setTelefone(
                data.phone
                    ? formatarTelefone(
                        data.phone
                    )
                    : telefone
            );

            setCep(
                data.cep
                    ? formatarCep(
                        data.cep
                    )
                    : cep
            );

            setLogradouro(
                data.logradouro ??
                logradouro
            );

            setNumero(
                data.numero ??
                numero
            );

            setComplemento(
                data.complemento ??
                complemento
            );

            setBairro(
                data.bairro ??
                bairro
            );

            setCidade(
                data.cidade ??
                cidade
            );

            setUf(
                data.uf ??
                uf
            );

            setSucesso(
                'Perfil atualizado com sucesso!'
            );
        } catch (error) {
            console.log(
                'Erro ao atualizar perfil:',
                JSON.stringify(
                    error,
                    null,
                    2
                )
            );

            setErro(
                'Ocorreu um erro. Tente novamente.'
            );
        } finally {
            setSalvando(false);
        }
    }

    // =========================
    // LOADING
    // =========================

    if (carregando) {
        return (
            <SafeAreaView
                style={
                    styles.safeArea
                }
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color={
                            colors.navy
                        }
                    />

                    <Text
                        style={
                            styles.loadingTexto
                        }
                    >
                        Carregando seu perfil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <KeyboardAvoidingView
                style={
                    styles.container
                }
                behavior={
                    Platform.OS ===
                        'ios'
                        ? 'padding'
                        : 'height'
                }
            >
                {/* HEADER */}

                <View
                    style={
                        styles.header
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.botaoVoltar
                        }
                        activeOpacity={
                            0.7
                        }
                        onPress={() =>
                            router.back()
                        }
                        disabled={
                            salvando
                        }
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={22}
                            color={
                                colors.navy
                            }
                        />

                        <Text
                            style={
                                styles.textoVoltar
                            }
                        >
                            Voltar
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={
                        styles.scrollContent
                    }
                >
                    {/* TÍTULO */}

                    <View
                        style={
                            styles.tituloContainer
                        }
                    >
                        <View
                            style={
                                styles.iconePerfil
                            }
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={32}
                                color={
                                    colors.navy
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.titulo
                            }
                        >
                            Meu perfil
                        </Text>

                        <Text
                            style={
                                styles.subtitulo
                            }
                        >
                            Atualize os dados do
                            aluno, contato e local
                            das aulas.
                        </Text>
                    </View>

                    {/* DADOS DO ALUNO */}

                    <View
                        style={
                            styles.card
                        }
                    >
                        <View
                            style={
                                styles.campoHeader
                            }
                        >
                            <MaterialCommunityIcons
                                name="account-music-outline"
                                size={21}
                                color={
                                    colors.navy
                                }
                            />

                            <Text
                                style={
                                    styles.campoTitulo
                                }
                            >
                                Dados do aluno
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Nome do aluno
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                erro
                                    ? styles.inputErro
                                    : null,
                            ]}
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

                                limparMensagens();
                            }}
                            editable={
                                !salvando
                            }
                            autoCapitalize="words"
                            autoCorrect={
                                false
                            }
                            maxLength={
                                100
                            }
                            returnKeyType="done"
                        />

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
                                        item
                                    ) => {
                                        const selecionado =
                                            faixaEtaria ===
                                            item.value;

                                        return (
                                            <TouchableOpacity
                                                key={
                                                    item.value
                                                }
                                                style={[
                                                    styles.faixaBotao,

                                                    selecionado &&
                                                    styles.faixaBotaoSelecionado,
                                                ]}
                                                activeOpacity={
                                                    0.8
                                                }
                                                disabled={
                                                    salvando
                                                }
                                                onPress={() => {
                                                    setFaixaEtaria(
                                                        item.value
                                                    );

                                                    limparMensagens();
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.faixaTexto,

                                                        selecionado &&
                                                        styles.faixaTextoSelecionado,
                                                    ]}
                                                >
                                                    {
                                                        item.label
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                )}
                            </View>
                        </View>
                    </View>

                    {/* TELEFONE */}

                    <View
                        style={[
                            styles.card,
                            styles.cardSecundario,
                        ]}
                    >
                        <View
                            style={
                                styles.campoHeader
                            }
                        >
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={21}
                                color={
                                    colors.navy
                                }
                            />

                            <Text
                                style={
                                    styles.campoTitulo
                                }
                            >
                                Telefone
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.label
                            }
                        >
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
                                !salvando
                            }
                            returnKeyType="done"
                        />
                    </View>

                    {/* ENDEREÇO */}

                    <View
                        style={[
                            styles.card,
                            styles.cardEndereco,
                        ]}
                    >
                        <View
                            style={
                                styles.campoHeader
                            }
                        >
                            <MaterialCommunityIcons
                                name="home-city-outline"
                                size={21}
                                color={
                                    colors.navy
                                }
                            />

                            <Text
                                style={
                                    styles.campoTitulo
                                }
                            >
                                Endereço das aulas
                            </Text>
                        </View>

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
                                    !salvando
                                }
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
                            <View
                                style={
                                    styles.mensagemErro
                                }
                            >
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={16}
                                    color={
                                        colors.danger
                                    }
                                />

                                <Text
                                    style={
                                        styles.textoErro
                                    }
                                >
                                    {
                                        erroCep
                                    }
                                </Text>
                            </View>
                        ) : null}

                        {!!logradouro && (
                            <>
                                <View
                                    style={
                                        styles.campoEndereco
                                    }
                                >
                                    <Text
                                        style={
                                            styles.label
                                        }
                                    >
                                        Endereço
                                    </Text>

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

                                            limparMensagens();
                                        }}
                                        editable={
                                            !salvando
                                        }
                                        returnKeyType="next"
                                    />
                                </View>

                                <View
                                    style={
                                        styles.campoEndereco
                                    }
                                >
                                    <Text
                                        style={
                                            styles.label
                                        }
                                    >
                                        Bairro
                                    </Text>

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

                                            limparMensagens();
                                        }}
                                        editable={
                                            !salvando
                                        }
                                        returnKeyType="next"
                                    />
                                </View>

                                <View
                                    style={
                                        styles.enderecoPreview
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="map-marker-check-outline"
                                        size={19}
                                        color={
                                            colors.navy
                                        }
                                    />

                                    <View
                                        style={
                                            styles.enderecoPreviewConteudo
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.enderecoRua
                                            }
                                        >
                                            Local encontrado
                                        </Text>

                                        <Text
                                            style={
                                                styles.enderecoCidade
                                            }
                                        >
                                            {
                                                cidade
                                            }
                                            /
                                            {
                                                uf
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        <View
                            style={
                                styles.linhaEndereco
                            }
                        >
                            <View
                                style={
                                    styles.campoNumero
                                }
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

                                        limparMensagens();
                                    }}
                                    editable={
                                        !salvando
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.campoComplemento
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Complemento
                                </Text>

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Apto 12"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    value={
                                        complemento
                                    }
                                    onChangeText={(
                                        valor
                                    ) => {
                                        setComplemento(
                                            valor
                                        );

                                        limparMensagens();
                                    }}
                                    editable={
                                        !salvando
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    {/* ERRO */}

                    {erro ? (
                        <View
                            style={
                                styles.mensagemGeralErro
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
                                    styles.textoErro
                                }
                            >
                                {erro}
                            </Text>
                        </View>
                    ) : null}

                    {/* SUCESSO */}

                    {sucesso ? (
                        <View
                            style={
                                styles.mensagemGeralSucesso
                            }
                        >
                            <MaterialCommunityIcons
                                name="check-circle-outline"
                                size={18}
                                color={
                                    colors.success
                                }
                            />

                            <Text
                                style={
                                    styles.textoSucesso
                                }
                            >
                                {
                                    sucesso
                                }
                            </Text>
                        </View>
                    ) : null}

                    {/* INFORMAÇÃO */}

                    <View
                        style={
                            styles.infoCard
                        }
                    >
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={20}
                            color={
                                colors.navy
                            }
                        />

                        <Text
                            style={
                                styles.infoTexto
                            }
                        >
                            O endereço informado será
                            utilizado como local das
                            aulas presenciais.
                        </Text>
                    </View>
                </ScrollView>

                {/* BOTÃO */}

                <View
                    style={
                        styles.footer
                    }
                >
                    <TouchableOpacity
                        style={[
                            styles.botaoSalvar,

                            salvando &&
                            styles.botaoSalvarDesabilitado,
                        ]}
                        activeOpacity={
                            0.85
                        }
                        onPress={
                            handleSalvar
                        }
                        disabled={
                            salvando
                        }
                    >
                        {salvando ? (
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
                                        styles.botaoSalvarTexto
                                    }
                                >
                                    Salvar alterações
                                </Text>

                                <MaterialCommunityIcons
                                    name="check"
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}