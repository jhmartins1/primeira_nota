
import { useAuth } from '@clerk/expo';
import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { instrumentConstants } from '../../constants/InstrumentConstants';
import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './InstrumentScreen.styles';

const INSTRUMENTOS =
    instrumentConstants.INSTRUMENTOS;

interface InstrumentoUsuario {
    instrumento: string;
    nivel: string;
}

interface UsuarioResponse {
    instrumentos?: InstrumentoUsuario[];

    usuario?: {
        instrumentos?: InstrumentoUsuario[];
    };
}

export function InstrumentScreen() {
    const router = useRouter();
    const { getToken } = useAuth();

    const {
        instrumentosIniciais,
        modoEdicao: modoEdicaoParam,
    } = useLocalSearchParams<{
        instrumentosIniciais?: string;
        modoEdicao?: string;
    }>();

    /*
     * Define se estamos no modo de edição.
     *
     * A Home envia:
     *
     * modoEdicao=true
     *
     * Também mantemos instrumentosIniciais como
     * fallback para compatibilidade.
     */
    const modoEdicao =
        modoEdicaoParam === 'true' ||
        !!instrumentosIniciais;

    /*
     * Instrumentos iniciais recebidos pela navegação.
     */
    const iniciais = useMemo<string[]>(() => {
        if (!instrumentosIniciais) {
            return [];
        }

        try {
            const parsed = JSON.parse(
                instrumentosIniciais
            );

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.filter(
                (item): item is string =>
                    typeof item === 'string'
            );
        } catch (error) {
            console.error(
                'Erro ao interpretar instrumentos iniciais:',
                error
            );

            return [];
        }
    }, [instrumentosIniciais]);

    /*
     * Instrumentos selecionados atualmente.
     */
    const [
        instrumentosSelecionados,
        setInstrumentosSelecionados,
    ] = useState<string[]>(iniciais);

    /*
     * Guarda os níveis dos instrumentos que o
     * usuário já possui.
     *
     * Exemplo:
     *
     * {
     *   Violão: 'Iniciante',
     *   Guitarra: 'Intermediário'
     * }
     */
    const [
        niveisExistentes,
        setNiveisExistentes,
    ] = useState<Record<string, string>>({});

    /*
     * Loading durante a busca dos instrumentos.
     */
    const [carregando, setCarregando] =
        useState(modoEdicao);

    /*
     * Busca os instrumentos existentes do usuário.
     */
    useEffect(() => {
        if (!modoEdicao) {
            setCarregando(false);
            return;
        }

        let cancelado = false;

        async function carregarInstrumentosUsuario() {
            try {
                setCarregando(true);

                const token = await getToken();

                if (!token) {
                    throw new Error('Token não encontrado.');
                }

                const response = await fetch(
                    'http://10.0.2.2:3333/usuario/me',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const texto = await response.text();

                if (!response.ok) {
                    throw new Error(
                        `Erro ${response.status}: ${texto}`
                    );
                }

                let data: UsuarioResponse;

                try {
                    data = JSON.parse(texto);
                } catch {
                    throw new Error(
                        `Backend não retornou JSON: ${texto}`
                    );
                }

                const instrumentosUsuario =
                    Array.isArray(data.instrumentos)
                        ? data.instrumentos
                        : Array.isArray(data.usuario?.instrumentos)
                            ? data.usuario.instrumentos
                            : [];

                const nomes =
                    instrumentosUsuario
                        .map((item) => item.instrumento)
                        .filter(
                            (nome): nome is string =>
                                typeof nome === 'string'
                        );

                const mapaNiveis: Record<string, string> = {};

                instrumentosUsuario.forEach((item) => {
                    if (
                        typeof item.instrumento === 'string' &&
                        typeof item.nivel === 'string'
                    ) {
                        mapaNiveis[item.instrumento] =
                            item.nivel;
                    }
                });

                if (!cancelado) {
                    setInstrumentosSelecionados(nomes);
                    setNiveisExistentes(mapaNiveis);
                }
            } catch (error) {
                if (!cancelado) {
                    console.error(
                        'Erro ao carregar instrumentos do usuário:',
                        error
                    );

                    setInstrumentosSelecionados(iniciais);
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        carregarInstrumentosUsuario();

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicao]);

    /*
     * Seleciona ou desmarca um instrumento.
     */
    function toggleInstrumento(
        instrumento: string
    ) {
        setInstrumentosSelecionados(
            (prev) => {
                /*
                 * Se já estiver selecionado,
                 * remove.
                 */
                if (
                    prev.includes(instrumento)
                ) {
                    return prev.filter(
                        (item) =>
                            item !== instrumento
                    );
                }

                /*
                 * Caso contrário, adiciona.
                 */
                return [
                    ...prev,
                    instrumento,
                ];
            }
        );
    }

    /*
     * Volta para a tela anterior.
     */
    function handleVoltar() {
        router.back();
    }

    /*
     * Vai para a tela de níveis.
     */
    function handleContinuar() {
        if (
            instrumentosSelecionados.length ===
            0
        ) {
            return;
        }

        router.push({
            pathname: '/level',

            params: {
                instrumentos:
                    JSON.stringify(
                        instrumentosSelecionados
                    ),

                niveisExistentes:
                    JSON.stringify(
                        niveisExistentes
                    ),

                modoEdicao:
                    modoEdicao
                        ? 'true'
                        : 'false',
            },
        });
    }

    /*
     * Tela de carregamento.
     */
    if (carregando) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={styles.loadingContainer}
                >
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text
                        style={styles.loadingTexto}
                    >
                        Carregando seus
                        instrumentos...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            {/* HEADER */}

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleVoltar}
                    activeOpacity={0.7}
                    style={styles.botaoVoltar}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={26}
                        color="#093373"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitulo}>
                    Primeira Nota
                </Text>
            </View>

            {/* CONTEÚDO */}

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                {/* TÍTULO */}

                <Text style={styles.titulo}>
                    {modoEdicao
                        ? 'Editar instrumentos'
                        : 'Quais instrumentos você toca?'}
                </Text>

                {/* SUBTÍTULO */}

                <Text style={styles.subtitulo}>
                    {modoEdicao
                        ? 'Selecione os instrumentos que deseja manter ou adicionar.'
                        : 'Selecione os instrumentos que você deseja aprender ou praticar.'}
                </Text>

                {/* LISTA */}

                <View
                    style={
                        styles.listaInstrumentos
                    }
                >
                    {INSTRUMENTOS.map(
                        (instrumento) => {
                            const selecionado =
                                instrumentosSelecionados.includes(
                                    instrumento
                                );

                            const icone =
                                getInstrumentIcon(
                                    instrumento
                                );

                            return (
                                <TouchableOpacity
                                    key={instrumento}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        toggleInstrumento(
                                            instrumento
                                        )
                                    }
                                    style={[
                                        styles.opcao,

                                        selecionado &&
                                        styles.opcaoSelecionada,
                                    ]}
                                >
                                    {/* ÍCONE */}

                                    <View
                                        style={[
                                            styles.iconeContainer,

                                            selecionado &&
                                            styles.iconeContainerSelecionado,
                                        ]}
                                    >
                                        {icone.familia ===
                                            'material' ? (
                                            <MaterialCommunityIcons
                                                name={icone.nome}
                                                size={32}
                                                color={
                                                    selecionado
                                                        ? '#FFFFFF'
                                                        : '#093373'
                                                }
                                            />
                                        ) : (
                                            <FontAwesome5
                                                name={icone.nome}
                                                size={30}
                                                color={
                                                    selecionado
                                                        ? '#FFFFFF'
                                                        : '#093373'
                                                }
                                            />
                                        )}
                                    </View>

                                    {/* NOME */}

                                    <Text
                                        style={[
                                            styles.nomeInstrumento,

                                            selecionado &&
                                            styles.nomeInstrumentoSelecionado,
                                        ]}
                                    >
                                        {instrumento}
                                    </Text>

                                    {/* CHECK */}

                                    {selecionado && (
                                        <View
                                            style={
                                                styles.checkContainer
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name="check"
                                                size={19}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }
                    )}
                </View>

                {/* BOTÃO CONTINUAR */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={
                        instrumentosSelecionados.length ===
                        0
                    }
                    onPress={handleContinuar}
                    style={[
                        styles.botaoContinuar,

                        instrumentosSelecionados.length ===
                        0 &&
                        styles.botaoContinuarDesabilitado,
                    ]}
                >
                    <Text
                        style={
                            styles.textoBotaoContinuar
                        }
                    >
                        Continuar
                    </Text>

                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={22}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

