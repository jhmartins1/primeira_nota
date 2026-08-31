import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { ScrollView } from 'react-native';
import { instrumentConstants } from '../../constants/InstrumentConstants';
import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './InstrumentScreen.styles';

const INSTRUMENTOS = instrumentConstants.INSTRUMENTOS;

export function InstrumentScreen() {
    const router = useRouter();

    const { instrumentosIniciais } = useLocalSearchParams<{
        instrumentosIniciais?: string;
    }>();

    /*
     * Se instrumentosIniciais existe, significa que o usuário
     * chegou aqui através da edição na Home.
     */
    const modoEdicao = !!instrumentosIniciais;

    const iniciais = useMemo<string[]>(() => {
        if (!instrumentosIniciais) return [];

        try {
            return JSON.parse(instrumentosIniciais) as string[];
        } catch {
            return [];
        }
    }, [instrumentosIniciais]);

    const [instrumentosSelecionados, setInstrumentosSelecionados] =
        useState<string[]>(iniciais);

    function toggleInstrumento(instrumento: string) {
        setInstrumentosSelecionados((prev) => {
            if (prev.includes(instrumento)) {
                return prev.filter((item) => item !== instrumento);
            }

            return [...prev, instrumento];
        });
    }

    function handleVoltar() {
        /*
         * Volta para a tela anterior sem salvar as alterações.
         */
        router.back();
    }

    function handleContinuar() {
        router.push({
            pathname: '/level',
            params: {
                instrumentos: JSON.stringify(instrumentosSelecionados),
            },
        });
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {modoEdicao && (
                        <TouchableOpacity
                            style={styles.botaoVoltar}
                            onPress={handleVoltar}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.seta}>‹</Text>
                            <Text style={styles.textoVoltar}>Voltar</Text>
                        </TouchableOpacity>
                    )}

                    <Image
                        source={require('../../../assets/images/primeira_nota_logo2.png')}
                        style={[styles.logo, modoEdicao && styles.logoEdicao]}
                        resizeMode="contain"
                    />

                    {modoEdicao ? (
                        <Text style={styles.tituloEdicao}>Editar instrumentos</Text>
                    ) : (
                        <Text style={styles.titulo}>
                            Bem vindo à Escola de Música{'\n'}
                            <Text style={styles.tituloAzul}>Primeira Nota</Text>
                        </Text>
                    )}

                    <Text style={styles.pergunta}>
                        Quais instrumentos deseja aprender ou evoluir?
                    </Text>

                    <View style={styles.opcoesContainer}>
                        {INSTRUMENTOS.map((instrumento) => {
                            const selecionado = instrumentosSelecionados.includes(instrumento);
                            const icone = getInstrumentIcon(instrumento);

                            return (
                                <TouchableOpacity
                                    key={instrumento}
                                    style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
                                    onPress={() => toggleInstrumento(instrumento)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.opcaoInterna}>
                                        <View style={styles.opcaoEsquerda}>
                                            {icone.familia === 'material' ? (
                                                <MaterialCommunityIcons
                                                    name={icone.nome}
                                                    size={22}
                                                    color={selecionado ? '#093373' : '#333'}
                                                />
                                            ) : (
                                                <FontAwesome5
                                                    name={icone.nome}
                                                    size={20}
                                                    color={selecionado ? '#093373' : '#333'}
                                                />
                                            )}
                                            <Text
                                                style={[
                                                    styles.opcaoTexto,
                                                    selecionado && styles.opcaoTextoSelecionado,
                                                ]}
                                            >
                                                {instrumento}
                                            </Text>
                                        </View>

                                        {selecionado && <Text style={styles.check}>✓</Text>}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* BOTÃO INFERIOR — fora do ScrollView, fixo */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.botaoContinuar,
                            instrumentosSelecionados.length === 0 && styles.botaoDesabilitado,
                        ]}
                        disabled={instrumentosSelecionados.length === 0}
                        onPress={handleContinuar}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.botaoTexto}>Continuar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}