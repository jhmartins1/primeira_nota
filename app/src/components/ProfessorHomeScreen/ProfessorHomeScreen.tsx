import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { AulaAlunoCard } from './AulaAlunoCard';
import { styles } from './ProfessorHomeScreen.styles';
import { useProfessorHomeData } from './useProfessorHomeData';

export default function ProfessorHomeScreen() {
    const router = useRouter();

    const {
        professor,
        carregando,
        atualizando,
        cancelandoId,
        erro,
        saindo,
        proximaAula,
        demaisAulas,
        carregarDados,
        atualizarTela,
        realizarLogout,
        confirmarCancelamento,
    } = useProfessorHomeData();

    function handleEditarInstrumentos() {
        router.push({
            pathname: '/instrument',
            params: {
                modoEdicao: 'true',
                tipoConta: 'professor',
            },
        });
    }

    if (carregando) {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text
                        style={{
                            marginTop: 12,
                            color: '#6B7280',
                            fontSize: 14,
                        }}
                    >
                        Carregando...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (erro && !professor) {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 30,
                    }}
                >
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={50}
                        color="#093373"
                    />

                    <Text
                        style={{
                            marginTop: 15,
                            fontSize: 19,
                            fontWeight: '800',
                            color: '#1A1E29',
                            textAlign: 'center',
                        }}
                    >
                        Não foi possível carregar
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 14,
                            lineHeight: 21,
                            color: '#6B7280',
                            textAlign: 'center',
                        }}
                    >
                        {erro}
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            backgroundColor: '#093373',
                            paddingHorizontal: 25,
                            paddingVertical: 13,
                            borderRadius: 12,
                        }}
                        onPress={() => carregarDados()}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '700',
                            }}
                        >
                            Tentar novamente
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={atualizarTela}
                        tintColor="#093373"
                    />
                }
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.eyebrow}>
                            PRIMEIRA NOTA · PROFESSOR
                        </Text>

                        <Text style={styles.titulo}>
                            Olá,{' '}
                            {professor?.name?.split(' ')[0] ??
                                'Professor'}
                            !
                        </Text>

                        <Text style={styles.subtitulo}>
                            Confira suas próximas aulas.
                        </Text>
                    </View>

                    <View style={styles.headerBotoes}>
                        <TouchableOpacity
                            style={styles.botaoEditarInstrumentos}
                            activeOpacity={0.8}
                            onPress={handleEditarInstrumentos}
                        >
                            <MaterialCommunityIcons
                                name="pencil-outline"
                                size={15}
                                color="#093373"
                            />

                            <Text
                                style={
                                    styles.botaoEditarInstrumentosTexto
                                }
                            >
                                Editar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={realizarLogout}
                            disabled={saindo}
                            style={styles.botaoLogout}
                        >
                            {saindo ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#B42318"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={21}
                                    color="#B42318"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* PRÓXIMA AULA */}

                {proximaAula ? (
                    <View style={styles.secao}>
                        <Text style={styles.secaoTitulo}>
                            Próxima aula
                        </Text>

                        <AulaAlunoCard
                            aula={proximaAula}
                            destaque
                            cancelando={
                                cancelandoId === proximaAula.id
                            }
                            onCancelar={() =>
                                confirmarCancelamento(proximaAula)
                            }
                        />
                    </View>
                ) : (
                    <View style={styles.semAulaCard}>
                        <View style={styles.semAulaIcone}>
                            <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                size={30}
                                color="#093373"
                            />
                        </View>

                        <Text style={styles.semAulaTitulo}>
                            Nenhuma aula agendada
                        </Text>

                        <Text style={styles.semAulaTexto}>
                            Assim que um aluno agendar uma aula com
                            você, ela aparece aqui.
                        </Text>
                    </View>
                )}

                {/* DEMAIS AULAS */}

                {demaisAulas.length > 0 && (
                    <View style={styles.secao}>
                        <Text style={styles.secaoTitulo}>
                            Demais aulas
                            <Text style={styles.secaoContador}>
                                {'  ·  '}
                                {demaisAulas.length}
                            </Text>
                        </Text>

                        <View style={styles.listaAulas}>
                            {demaisAulas.map((aula) => (
                                <AulaAlunoCard
                                    key={aula.id}
                                    aula={aula}
                                    cancelando={
                                        cancelandoId === aula.id
                                    }
                                    onCancelar={() =>
                                        confirmarCancelamento(aula)
                                    }
                                />
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}