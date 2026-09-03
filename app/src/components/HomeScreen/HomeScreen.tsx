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

import { AulaCard } from './AulaCard';
import { styles } from './HomeScreen.styles';
import { InstrumentoCard } from './InstrumentoCard';
import { ProximaAulaCard } from './ProximaAulaCard';
import { useHomeData } from './useHomeData';

export default function HomeScreen() {
    const router = useRouter();

    const {
        usuario,
        agendamentos,
        carregando,
        atualizando,
        cancelandoId,
        erro,
        saindo,
        proximaAula,
        demaisAulas,
        carregarDados,
        atualizarTela,
        confirmarLogout,
        confirmarCancelamento,
    } = useHomeData();

    // ============================================================
    // LOADING
    // ============================================================

    if (carregando) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#093373" />
                    <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>
                        Carregando...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ============================================================
    // ERRO
    // ============================================================

    if (erro && !usuario) {
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
                    <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#093373" />

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
                        <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Tentar novamente</Text>
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
                    <RefreshControl refreshing={atualizando} onRefresh={atualizarTela} tintColor="#093373" />
                }
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.eyebrow}>PRIMEIRA NOTA</Text>

                        <Text style={styles.titulo}>
                            Olá, {usuario?.name?.split(' ')[0] ?? 'Aluno'}!
                        </Text>

                        <Text style={styles.subtitulo}>
                            Acompanhe suas aulas e continue evoluindo.
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={confirmarLogout}
                        disabled={saindo}
                        style={[styles.botaoLogout, saindo && styles.botaoLogoutCarregando]}
                    >
                        {saindo ? (
                            <ActivityIndicator size="small" color="#B42318" />
                        ) : (
                            <MaterialCommunityIcons name="logout" size={21} color="#B42318" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* PRÓXIMA AULA */}

                {proximaAula ? (
                    <ProximaAulaCard
                        aula={proximaAula}
                        cancelando={cancelandoId === proximaAula.id}
                        onCancelar={() => confirmarCancelamento(proximaAula)}
                    />
                ) : (
                    <View style={styles.semAulaCard}>
                        <View style={styles.semAulaIcone}>
                            <MaterialCommunityIcons name="calendar-plus" size={30} color="#093373" />
                        </View>

                        <Text style={styles.semAulaTitulo}>Você não tem aulas agendadas</Text>

                        <Text style={styles.semAulaTexto}>
                            Agende uma aula e comece sua próxima evolução musical.
                        </Text>
                    </View>
                )}

                {/* BOTÃO AGENDAR */}

                <TouchableOpacity
                    style={styles.botaoAgendar}
                    activeOpacity={0.85}
                    onPress={() => router.push('/agendamento')}
                >
                    <View style={styles.botaoAgendarIcone}>
                        <MaterialCommunityIcons name="calendar-plus" size={24} color="#093373" />
                    </View>

                    <View style={styles.botaoAgendarInfo}>
                        <Text style={styles.botaoAgendarTitulo}>Agendar nova aula</Text>
                        <Text style={styles.botaoAgendarSubtitulo}>
                            Escolha instrumento, professor, dia e horário
                        </Text>
                    </View>

                    <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* MINHAS AULAS */}

                <View style={styles.secao}>
                    <View style={styles.secaoHeader}>
                        <View>
                            <Text style={styles.secaoTitulo}>Minhas aulas</Text>
                            <Text style={styles.secaoSubtitulo}>Próximos agendamentos</Text>
                        </View>

                        {agendamentos.length > 3 && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => router.push('/agendamentos')}
                            >
                                <Text style={styles.verTodas}>
                                    Ver todas
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {demaisAulas.length > 0 ? (
                        <View style={styles.listaAulas}>
                            {demaisAulas.map((aula) => (
                                <AulaCard
                                    key={aula.id}
                                    aula={aula}
                                    cancelando={cancelandoId === aula.id}
                                    onCancelar={() => confirmarCancelamento(aula)}
                                />
                            ))}
                        </View>
                    ) : (
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#E7EAF0',
                                padding: 18,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 13, color: '#6B7280' }}>
                                Nenhuma outra aula agendada.
                            </Text>
                        </View>
                    )}
                </View>

                {/* MEUS INSTRUMENTOS */}

                <View style={styles.secao}>
                    <View style={styles.secaoHeader}>
                        <View>
                            <Text style={styles.secaoTitulo}>Meus instrumentos</Text>
                            <Text style={styles.secaoSubtitulo}>Seus níveis atuais</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.botaoEditarInstrumentos}
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push({
                                    pathname: '/instrument',
                                    params: { modoEdicao: 'true' },
                                })
                            }
                        >
                            <MaterialCommunityIcons name="pencil-outline" size={15} color="#093373" />
                            <Text style={styles.botaoEditarInstrumentosTexto}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                    {usuario?.instrumentos?.length ? (
                        <View style={styles.instrumentosLista}>
                            {usuario.instrumentos.map((instrumento, index) => (
                                <InstrumentoCard
                                    key={`${instrumento.instrumento}-${index}`}
                                    instrumento={instrumento}
                                    onPress={() => router.push('/agendamento')}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.instrumentosVazio}>
                            <Text style={styles.instrumentosVazioTexto}>
                                Você ainda não possui instrumentos cadastrados.
                            </Text>

                            <TouchableOpacity onPress={() => router.push('/instrument')}>
                                <Text style={styles.instrumentosVazioLink}>Adicionar instrumento</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}