import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { instrumentConstants } from '../../constants/InstrumentConstants';

import { InstrumentoOption } from './InstrumentoOption';

import { styles } from './InstrumentScreen.styles';

import {
    TipoConta,
    useInstrumentosUsuario,
} from './useInstrumentosUsuario';

const INSTRUMENTOS =
    instrumentConstants.INSTRUMENTOS;

export function InstrumentScreen() {
    const router =
        useRouter();

    const {
        instrumentosIniciais,

        modoEdicao:
        modoEdicaoParam,

        tipoConta:
        tipoContaParam,
    } =
        useLocalSearchParams<{
            instrumentosIniciais?: string;
            modoEdicao?: string;
            tipoConta?: string;
        }>();

    const modoEdicao =
        modoEdicaoParam ===
        'true' ||
        !!instrumentosIniciais;

    const tipoConta:
        TipoConta =
        tipoContaParam ===
            'professor'
            ? 'professor'
            : 'usuario';

    const iniciais =
        useMemo<
            string[]
        >(() => {
            if (
                !instrumentosIniciais
            ) {
                return [];
            }

            try {
                const parsed =
                    JSON.parse(
                        instrumentosIniciais
                    );

                return Array.isArray(
                    parsed
                )
                    ? parsed.filter(
                        (
                            item
                        ): item is string =>
                            typeof item ===
                            'string'
                    )
                    : [];
            } catch (
            error
            ) {
                console.error(
                    'Erro ao interpretar instrumentos iniciais:',
                    error
                );

                return [];
            }
        }, [
            instrumentosIniciais,
        ]);

    const {
        instrumentosSelecionados,
        setInstrumentosSelecionados,

        niveisExistentes,

        instrumentosPossuidosIniciais,

        carregando,
    } =
        useInstrumentosUsuario({
            modoEdicao,
            iniciais,
            tipoConta,
        });

    const [
        instrumentosPossuidos,
        setInstrumentosPossuidos,
    ] =
        useState<
            Record<
                string,
                boolean
            >
        >({});

    useEffect(() => {
        if (
            tipoConta !==
            'usuario'
        ) {
            return;
        }

        if (
            Object.keys(
                instrumentosPossuidosIniciais
            ).length === 0
        ) {
            return;
        }

        setInstrumentosPossuidos(
            instrumentosPossuidosIniciais
        );
    }, [
        instrumentosPossuidosIniciais,
        tipoConta,
    ]);

    function toggleInstrumento(
        instrumento: string
    ) {
        const jaSelecionado =
            instrumentosSelecionados.includes(
                instrumento
            );

        setInstrumentosSelecionados(
            (
                prev
            ) =>
                jaSelecionado
                    ? prev.filter(
                        (
                            item
                        ) =>
                            item !==
                            instrumento
                    )
                    : [
                        ...prev,
                        instrumento,
                    ]
        );
        if (
            tipoConta ===
            'usuario'
        ) {
            if (
                jaSelecionado
            ) {
                setInstrumentosPossuidos(
                    (
                        prev
                    ) => {
                        const novo = {
                            ...prev,
                        };

                        delete novo[
                            instrumento
                        ];

                        return novo;
                    }
                );
            } else {
                setInstrumentosPossuidos(
                    (
                        prev
                    ) => ({
                        ...prev,

                        [instrumento]:
                            false,
                    })
                );
            }
        }
    }

    function togglePossuiInstrumento(
        instrumento: string
    ) {
        if (
            tipoConta !==
            'usuario'
        ) {
            return;
        }

        setInstrumentosPossuidos(
            (
                prev
            ) => ({
                ...prev,

                [instrumento]:
                    !prev[
                    instrumento
                    ],
            })
        );
    }

    function handleContinuar() {
        if (
            instrumentosSelecionados.length ===
            0
        ) {
            return;
        }

        router.push({
            pathname:
                '/level',

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

                tipoConta,

                // SOMENTE ALUNO
                instrumentosPossuidos:
                    tipoConta ===
                        'usuario'
                        ? JSON.stringify(
                            instrumentosPossuidos
                        )
                        : undefined,
            },
        });
    }

    if (carregando) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
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
                        style={
                            styles.loadingTexto
                        }
                    >
                        Carregando seus instrumentos...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <TouchableOpacity
                    onPress={() =>
                        router.back()
                    }
                    activeOpacity={
                        0.7
                    }
                    style={
                        styles.botaoVoltar
                    }
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={26}
                        color="#093373"
                    />
                </TouchableOpacity>

                <Text
                    style={
                        styles.headerTitulo
                    }
                >
                    Primeira Nota
                </Text>
            </View>

            <ScrollView
                style={
                    styles.scroll
                }
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <Text
                    style={
                        styles.titulo
                    }
                >
                    {modoEdicao
                        ? 'Editar instrumentos'
                        : tipoConta ===
                            'professor'
                            ? 'Quais instrumentos você ensina?'
                            : 'Quais instrumentos você toca?'}
                </Text>

                <Text
                    style={
                        styles.subtitulo
                    }
                >
                    {tipoConta ===
                        'professor'
                        ? 'Selecione os instrumentos que você pode ensinar.'
                        : modoEdicao
                            ? 'Selecione os instrumentos que deseja manter ou adicionar e informe quais você possui.'
                            : 'Selecione os instrumentos que deseja aprender ou praticar e informe quais você possui.'}
                </Text>

                <View
                    style={
                        styles.listaInstrumentos
                    }
                >
                    {INSTRUMENTOS.map(
                        (
                            instrumento
                        ) => {
                            const selecionado =
                                instrumentosSelecionados.includes(
                                    instrumento
                                );

                            return (
                                <InstrumentoOption
                                    key={
                                        instrumento
                                    }
                                    instrumento={
                                        instrumento
                                    }
                                    selecionado={
                                        selecionado
                                    }
                                    onPress={() =>
                                        toggleInstrumento(
                                            instrumento
                                        )
                                    }

                                    // SOMENTE ALUNO
                                    mostrarPossuiInstrumento={
                                        tipoConta ===
                                        'usuario'
                                    }
                                    possuiInstrumento={
                                        instrumentosPossuidos[
                                        instrumento
                                        ] ===
                                        true
                                    }
                                    onTogglePossuiInstrumento={() =>
                                        togglePossuiInstrumento(
                                            instrumento
                                        )
                                    }
                                />
                            );
                        }
                    )}
                </View>

                <TouchableOpacity
                    activeOpacity={
                        0.8
                    }
                    disabled={
                        instrumentosSelecionados.length ===
                        0
                    }
                    onPress={
                        handleContinuar
                    }
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