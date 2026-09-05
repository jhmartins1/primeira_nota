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

import { useBuscaCep } from '../../hooks/useBuscaCep';
import { styles } from './ProfileScreen.styles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
    const router = useRouter();
    const { getToken } = useAuth();

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
                setErro(
                    'Não foi possível autenticar o usuário.'
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/usuario/me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErro(
                    data.error ??
                    'Não foi possível carregar seu perfil.'
                );
                return;
            }

            setTelefone(
                data.phone
                    ? formatarTelefone(data.phone)
                    : ''
            );

            setCep(
                data.cep
                    ? formatarCep(data.cep)
                    : ''
            );

            setLogradouro(data.logradouro ?? '');
            setNumero(data.numero ?? '');
            setComplemento(data.complemento ?? '');
            setBairro(data.bairro ?? '');
            setCidade(data.cidade ?? '');
            setUf(data.uf ?? '');
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

    function limparMensagens() {
        if (erro) {
            setErro('');
        }

        if (sucesso) {
            setSucesso('');
        }
    }

    function handleChangeTelefone(valor: string) {
        setTelefone(formatarTelefone(valor));
        limparMensagens();
    }

    async function handleChangeCep(valor: string) {
        const formatado = formatarCep(valor);

        setCep(formatado);
        limparMensagens();

        const somenteNumeros =
            formatado.replace(/\D/g, '');

        if (somenteNumeros.length !== 8) {
            return;
        }

        const endereco =
            await buscarEnderecoPorCep(formatado);

        if (!endereco) {
            return;
        }

        setLogradouro(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.localidade);
        setUf(endereco.uf);

        // Opcional:
        // ao trocar o CEP, limpamos o número
        // porque provavelmente é outro endereço.
        setNumero('');
        setComplemento('');
    }

    async function handleSalvar() {
        const telefoneNumeros =
            telefone.replace(/\D/g, '');

        const cepNumeros =
            cep.replace(/\D/g, '');

        if (telefoneNumeros.length < 10) {
            setErro(
                'Digite um telefone válido com DDD.'
            );
            return;
        }

        if (cepNumeros.length !== 8) {
            setErro('Digite um CEP válido.');
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

        if (!numero.trim()) {
            setErro(
                'Digite o número da residência.'
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
                setErro('API não configurada.');
                return;
            }

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
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        phone: telefoneNumeros,

                        cep: cepNumeros,
                        logradouro,
                        numero: numero.trim(),
                        complemento:
                            complemento.trim() ||
                            undefined,
                        bairro,
                        cidade,
                        uf,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErro(
                    data.error ??
                    'Não foi possível atualizar seus dados.'
                );
                return;
            }

            setTelefone(
                data.phone
                    ? formatarTelefone(data.phone)
                    : telefone
            );

            setCep(
                data.cep
                    ? formatarCep(data.cep)
                    : cep
            );

            setLogradouro(
                data.logradouro ?? logradouro
            );
            setNumero(data.numero ?? numero);
            setComplemento(
                data.complemento ??
                complemento
            );
            setBairro(data.bairro ?? bairro);
            setCidade(data.cidade ?? cidade);
            setUf(data.uf ?? uf);

            setSucesso(
                'Perfil atualizado com sucesso!'
            );
        } catch (error) {
            console.log(
                'Erro ao atualizar perfil:',
                JSON.stringify(error, null, 2)
            );

            setErro(
                'Ocorreu um erro. Tente novamente.'
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <SafeAreaView
                style={styles.safeArea}
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text
                        style={styles.loadingTexto}
                    >
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
                        onPress={() =>
                            router.back()
                        }
                        disabled={salvando}
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
                                color="#093373"
                            />
                        </View>

                        <Text
                            style={styles.titulo}
                        >
                            Meu perfil
                        </Text>

                        <Text
                            style={
                                styles.subtitulo
                            }
                        >
                            Atualize seus dados
                            pessoais e o local das
                            aulas.
                        </Text>
                    </View>

                    {/* TELEFONE */}
                    <View style={styles.card}>
                        <View
                            style={
                                styles.campoHeader
                            }
                        >
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={21}
                                color="#093373"
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
                            style={styles.label}
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
                                color="#093373"
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
                            style={styles.label}
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
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                value={cep}
                                onChangeText={
                                    handleChangeCep
                                }
                                maxLength={9}
                                editable={
                                    !salvando
                                }
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
                            <View
                                style={
                                    styles.mensagemErro
                                }
                            >
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#B42318"
                                />

                                <Text
                                    style={
                                        styles.textoErro
                                    }
                                >
                                    {erroCep}
                                </Text>
                            </View>
                        ) : null}

                        {!!logradouro && (
                            <>
                                <View style={styles.campoEndereco}>
                                    <Text style={styles.label}>
                                        Endereço
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Rua, avenida..."
                                        placeholderTextColor="#9CA3AF"
                                        value={logradouro}
                                        onChangeText={(valor) => {
                                            setLogradouro(valor);
                                            limparMensagens();
                                        }}
                                        editable={!salvando}
                                        returnKeyType="next"
                                    />
                                </View>

                                <View style={styles.campoEndereco}>
                                    <Text style={styles.label}>
                                        Bairro
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Bairro"
                                        placeholderTextColor="#9CA3AF"
                                        value={bairro}
                                        onChangeText={(valor) => {
                                            setBairro(valor);
                                            limparMensagens();
                                        }}
                                        editable={!salvando}
                                        returnKeyType="next"
                                    />
                                </View>

                                <View style={styles.enderecoPreview}>
                                    <MaterialCommunityIcons
                                        name="map-marker-check-outline"
                                        size={19}
                                        color="#093373"
                                    />

                                    <View
                                        style={
                                            styles.enderecoPreviewConteudo
                                        }
                                    >
                                        <Text
                                            style={styles.enderecoRua}
                                        >
                                            Local encontrado
                                        </Text>

                                        <Text
                                            style={
                                                styles.enderecoCidade
                                            }
                                        >
                                            {cidade}/{uf}
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
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                    value={numero}
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
                                    placeholderTextColor="#9CA3AF"
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
                                color="#B42318"
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

                    {/* INFORMAÇÃO */}
                    <View
                        style={styles.infoCard}
                    >
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={20}
                            color="#093373"
                        />

                        <Text
                            style={styles.infoTexto}
                        >
                            O endereço informado será
                            utilizado como local das
                            aulas presenciais.
                        </Text>
                    </View>
                </ScrollView>

                {/* BOTÃO */}
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