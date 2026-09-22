import { colors } from '../../theme/colors';
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

import { AulaCard } from '../HomeScreen/AulaCard';
import { Agendamento } from '../HomeScreen/types';
import { useHomeData } from '../HomeScreen/useHomeData';
import { styles } from './AgendamentosScreen.styles';

export default function AgendamentosScreen() {
    const router = useRouter();

    const {
        agendamentos,
        carregando,
        atualizando,
        cancelandoId,
        erro,
        atualizarTela,
        confirmarCancelamento,
    } = useHomeData();

    function abrirRemarcacao(
        aula: Agendamento
    ) {
        router.push({
            pathname:
                '/remarcar-agendamento',

            params: {
                agendamentoId:
                    String(aula.id),

                professorId:
                    String(
                        aula.professorId
                    ),

                instrumentoId:
                    String(
                        aula.instrumentoId
                    ),

                nivelId:
                    String(
                        aula.nivelId
                    ),

                professorNome:
                    aula.professor.name,

                instrumentoNome:
                    aula.instrumento.name,

                nivelNome:
                    aula.nivel.name,

                dataHoraAtual:
                    aula.dataHora,
            },
        });
    }

    if (carregando) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color={colors.navy}
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Carregando suas
                        aulas...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            atualizando
                        }
                        onRefresh={
                            atualizarTela
                        }
                    />
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <View
                    style={styles.header}
                >
                    <TouchableOpacity
                        style={
                            styles.botaoVoltar
                        }
                        activeOpacity={0.7}
                        onPress={() =>
                            router.back()
                        }
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={24}
                            color={colors.navy}
                        />
                    </TouchableOpacity>

                    <View
                        style={
                            styles.headerTexto
                        }
                    >
                        <Text
                            style={
                                styles.titulo
                            }
                        >
                            Minhas aulas
                        </Text>

                        <Text
                            style={
                                styles.subtitulo
                            }
                        >
                            Todos os seus
                            próximos
                            agendamentos
                        </Text>
                    </View>
                </View>

                {erro ? (
                    <View
                        style={
                            styles.estadoContainer
                        }
                    >
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={42}
                            color={colors.danger}
                        />

                        <Text
                            style={
                                styles.estadoTitulo
                            }
                        >
                            Não foi possível
                            carregar suas aulas
                        </Text>

                        <Text
                            style={
                                styles.estadoTexto
                            }
                        >
                            {erro}
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.botaoTentarNovamente
                            }
                            activeOpacity={
                                0.8
                            }
                            onPress={() =>
                                atualizarTela()
                            }
                        >
                            <Text
                                style={
                                    styles.botaoTentarNovamenteTexto
                                }
                            >
                                Tentar novamente
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : agendamentos.length >
                    0 ? (
                    <View
                        style={styles.lista}
                    >
                        {agendamentos.map(
                            (aula) => (
                                <AulaCard
                                    key={
                                        aula.id
                                    }
                                    aula={
                                        aula
                                    }
                                    cancelando={
                                        cancelandoId ===
                                        aula.id
                                    }
                                    onRemarcar={() =>
                                        abrirRemarcacao(
                                            aula
                                        )
                                    }
                                    onCancelar={() =>
                                        confirmarCancelamento(
                                            aula
                                        )
                                    }
                                />
                            )
                        )}
                    </View>
                ) : (
                    <View
                        style={
                            styles.estadoContainer
                        }
                    >
                        <MaterialCommunityIcons
                            name="calendar-blank-outline"
                            size={48}
                            color={colors.textMuted}
                        />

                        <Text
                            style={
                                styles.estadoTitulo
                            }
                        >
                            Nenhuma aula
                            agendada
                        </Text>

                        <Text
                            style={
                                styles.estadoTexto
                            }
                        >
                            Você ainda não
                            possui próximos
                            agendamentos.
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.botaoAgendar
                            }
                            activeOpacity={
                                0.8
                            }
                            onPress={() =>
                                router.push(
                                    '/agendamento'
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.botaoAgendarTexto
                                }
                            >
                                Agendar nova
                                aula
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}