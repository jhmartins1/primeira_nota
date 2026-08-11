import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { instrumentConstants } from '../../constants/InstrumentConstants';
import { styles } from './InstrumentScreen.styles';

const INSTRUMENTOS = instrumentConstants.INSTRUMENTOS;

export function InstrumentScreen() {
    const router = useRouter();

    const { instrumentosIniciais } = useLocalSearchParams<{
        instrumentosIniciais?: string;
    }>();

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

    function handleContinuar() {
        router.push({
            pathname: '/level',
            params: {
                instrumentos: JSON.stringify(instrumentosSelecionados),
            },
        });
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/primeira_nota_logo2.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.titulo}>
                Bem vindo à Escola de Música{'\n'}Primeira Nota
            </Text>

            <Text style={styles.pergunta}>
                Quais instrumentos deseja aprender ou evoluir?
            </Text>

            <View style={styles.opcoesContainer}>
                {INSTRUMENTOS.map((instrumento) => {
                    const selecionado =
                        instrumentosSelecionados.includes(instrumento);

                    return (
                        <TouchableOpacity
                            key={instrumento}
                            style={[
                                styles.opcao,
                                selecionado && styles.opcaoSelecionada,
                            ]}
                            onPress={() => toggleInstrumento(instrumento)}
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                }}
                            >
                                <Text
                                    style={[
                                        styles.opcaoTexto,
                                        selecionado &&
                                        styles.opcaoTextoSelecionado,
                                    ]}
                                >
                                    {instrumento}
                                </Text>

                                {selecionado && (
                                    <Text
                                        style={{
                                            color: '#093373',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ✓
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity
                style={[
                    styles.botaoContinuar,
                    instrumentosSelecionados.length === 0 &&
                    styles.botaoDesabilitado,
                ]}
                disabled={instrumentosSelecionados.length === 0}
                onPress={handleContinuar}
            >
                <Text style={styles.botaoTexto}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}