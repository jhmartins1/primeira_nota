import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LevelConstants } from '../../constants/LevelConstants';
import { getSelecao, setSelecao, type Selecao } from '../../utils/onboarding';
import { styles } from './HomeScreen.styles';

const NIVEIS = LevelConstants.NIVEIS;

export function HomeScreen() {
    const router = useRouter();

    const [selecao, setSelecaoState] = useState<Selecao>({});
    const [instrumentoEmEdicao, setInstrumentoEmEdicao] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            getSelecao().then((valor) => {
                if (ativo) {
                    setSelecaoState(valor);
                    setCarregando(false);
                }
            });

            return () => {
                ativo = false;
            };
        }, [])
    );

    async function alterarNivel(instrumento: string, nivel: string) {
        const novaSelecao = { ...selecao, [instrumento]: nivel };
        setSelecaoState(novaSelecao);
        await setSelecao(novaSelecao);
        setInstrumentoEmEdicao(null);
    }

    function handleTrocarInstrumentos() {
        router.push({
            pathname: '/instrument',
            params: {
                instrumentosIniciais: JSON.stringify(Object.keys(selecao)),
            },
        });
    }

    function handleAgendar(instrumento: string) {
        router.push({
            pathname: '/agendamento',
            params: {
                instrumento,
                nivel: selecao[instrumento],
            },
        });
    }

    if (carregando) {
        return <View style={styles.container} />;
    }

    const instrumentos = Object.keys(selecao);

    if (instrumentos.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>Primeira Nota</Text>
                    <Text style={styles.titulo}>Seus instrumentos</Text>
                </View>

                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioTexto}>
                        Você ainda não selecionou nenhum instrumento.
                    </Text>
                    <TouchableOpacity
                        style={styles.botaoTrocar}
                        onPress={handleTrocarInstrumentos}
                    >
                        <Text style={styles.botaoTrocarTexto}>
                            Escolher instrumentos
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>Primeira Nota</Text>
                <Text style={styles.titulo}>Seus instrumentos</Text>
                <Text style={styles.subtitulo}>
                    Acompanhe seu nível e agende aulas
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {instrumentos.map((instrumento) => {
                    const emEdicao = instrumentoEmEdicao === instrumento;

                    return (
                        <View key={instrumento} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.instrumentoNome}>
                                        {instrumento}
                                    </Text>

                                    <View style={styles.nivelBadge}>
                                        <Text style={styles.nivelBadgeTexto}>
                                            {selecao[instrumento]}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.botaoEditar}
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        setInstrumentoEmEdicao(
                                            emEdicao ? null : instrumento
                                        )
                                    }
                                >
                                    <Text style={styles.botaoEditarTexto}>
                                        {emEdicao ? '✕' : '✎'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {emEdicao && (
                                <View style={styles.niveisContainer}>
                                    {NIVEIS.map((nivel) => {
                                        const selecionado =
                                            selecao[instrumento] === nivel;

                                        return (
                                            <TouchableOpacity
                                                key={nivel}
                                                style={[
                                                    styles.opcaoNivel,
                                                    selecionado &&
                                                    styles.opcaoNivelSelecionada,
                                                ]}
                                                onPress={() =>
                                                    alterarNivel(
                                                        instrumento,
                                                        nivel
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.opcaoNivelTexto,
                                                        selecionado &&
                                                        styles.opcaoNivelTextoSelecionado,
                                                    ]}
                                                >
                                                    {nivel}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.botaoAgendarCard}
                                onPress={() => handleAgendar(instrumento)}
                            >
                                <Text style={styles.botaoAgendarCardTexto}>
                                    Agendar aula de {instrumento}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                <TouchableOpacity
                    style={styles.botaoTrocar}
                    onPress={handleTrocarInstrumentos}
                >
                    <Text style={styles.botaoTrocarTexto}>
                        Trocar instrumentos
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}