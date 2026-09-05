import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

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

import { getInstrumentIcon } from '../../constants/InstrumentIcons';

import { AulaAlunoCard } from './AulaAlunoCard';

import { styles } from './ProfessorHomeScreen.styles';

import {
    AgendamentoProfessor,
} from './types';

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

    // ----------------------------------------------------
    // EDITAR INSTRUMENTOS
    // ----------------------------------------------------

    function handleEditarInstrumentos() {
        router.push({
            pathname: '/instrument',

            params: {
                modoEdicao: 'true',
                tipoConta: 'professor',
            },
        });
    }

    // ----------------------------------------------------
    // REMARCAR AULA
    // ----------------------------------------------------

    function abrirRemarcacao(
        aula: AgendamentoProfessor
    ) {
        router.push({
            pathname:
                '/remarcar-agendamento-professor',

            params: {
                agendamentoId:
                    String(aula.id),

                professorId:
                    String(aula.professorId),

                usuarioId:
                    String(aula.usuarioId),

                instrumentoId:
                    String(
                        aula.instrumentoId
                    ),

                nivelId:
                    String(aula.nivelId),

                alunoNome:
                    aula.usuario.name,

                instrumentoNome:
                    aula.instrumento.name,

                nivelNome:
                    aula.nivel.name,

                dataHoraAtual:
                    aula.dataHora,
            },
        });
    }

    // ----------------------------------------------------
    // INSTRUMENTOS ÚNICOS
    // ----------------------------------------------------

    const instrumentosUnicos =
        Array.from(
            new Set(
                professor?.instrumentos?.map(
                    (item) =>
                        item.instrumento
                ) ?? []
            )
        );

    // ----------------------------------------------------
    // LOADING
    // ----------------------------------------------------

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
                        Carregando...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ----------------------------------------------------
    // ERRO
    // ----------------------------------------------------

    if (
        erro &&
        !professor
    ) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.erroContainer
                    }
                >
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={50}
                        color="#093373"
                    />

                    <Text
                        style={
                            styles.erroTitulo
                        }
                    >
                        Não foi possível
                        carregar
                    </Text>

                    <Text
                        style={
                            styles.erroTexto
                        }
                    >
                        {erro}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.botaoTentarNovamente
                        }
                        activeOpacity={
                            0.85
                        }
                        onPress={() =>
                            carregarDados()
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
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            atualizando
                        }
                        onRefresh={
                            atualizarTela
                        }
                        tintColor="#093373"
                    />
                }
            >
                {/* ================================= */}

                {/* HEADER */}

                {/* ================================= */}

                <View
                    style={
                        styles.header
                    }
                >
                    <View
                        style={
                            styles.headerTopo
                        }
                    >
                        <Text
                            style={
                                styles.eyebrow
                            }
                        >
                            PRIMEIRA NOTA ·
                            PROFESSOR
                        </Text>

                        <View
                            style={
                                styles.headerBotoes
                            }
                        >
                            {/* HORÁRIOS */}

                            <TouchableOpacity
                                style={
                                    styles.botaoHorarios
                                }
                                activeOpacity={
                                    0.8
                                }
                                onPress={() =>
                                    router.push(
                                        '/disponibilidade'
                                    )
                                }
                            >
                                <MaterialCommunityIcons
                                    name="calendar-clock-outline"
                                    size={17}
                                    color="#093373"
                                />

                                <Text
                                    style={
                                        styles.botaoHorariosTexto
                                    }
                                >
                                    Horários
                                </Text>
                            </TouchableOpacity>

                            {/* EDITAR INSTRUMENTOS */}

                            <TouchableOpacity
                                style={
                                    styles.botaoAcaoCircular
                                }
                                activeOpacity={
                                    0.8
                                }
                                onPress={
                                    handleEditarInstrumentos
                                }
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={19}
                                    color="#093373"
                                />
                            </TouchableOpacity>

                            {/* LOGOUT */}

                            <TouchableOpacity
                                activeOpacity={
                                    0.8
                                }
                                onPress={
                                    realizarLogout
                                }
                                disabled={
                                    saindo
                                }
                                style={[
                                    styles.botaoLogout,

                                    saindo &&
                                    styles.botaoLogoutCarregando,
                                ]}
                            >
                                {saindo ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#B42318"
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="logout"
                                        size={20}
                                        color="#B42318"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* SAUDAÇÃO */}

                    <View
                        style={
                            styles.headerSaudacao
                        }
                    >
                        <Text
                            style={
                                styles.titulo
                            }
                        >
                            Olá,{' '}
                            {professor?.name?.split(
                                ' '
                            )[0] ??
                                'Professor'}
                            !
                        </Text>

                        <Text
                            style={
                                styles.subtitulo
                            }
                        >
                            Confira suas
                            próximas aulas.
                        </Text>
                    </View>

                    {/* INSTRUMENTOS */}

                    {instrumentosUnicos.length >
                        0 && (
                            <View
                                style={
                                    styles.instrumentosContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.instrumentosLabel
                                    }
                                >
                                    Seus
                                    instrumentos
                                </Text>

                                <View
                                    style={
                                        styles.instrumentosLista
                                    }
                                >
                                    {instrumentosUnicos.map(
                                        (
                                            instrumento
                                        ) => {
                                            const icone =
                                                getInstrumentIcon(
                                                    instrumento
                                                );

                                            return (
                                                <View
                                                    key={
                                                        instrumento
                                                    }
                                                    style={
                                                        styles.instrumentoIconeCard
                                                    }
                                                >
                                                    {icone.familia ===
                                                        'material' ? (
                                                        <MaterialCommunityIcons
                                                            name={
                                                                icone.nome
                                                            }
                                                            size={
                                                                26
                                                            }
                                                            color="#093373"
                                                        />
                                                    ) : (
                                                        <FontAwesome5
                                                            name={
                                                                icone.nome
                                                            }
                                                            size={
                                                                23
                                                            }
                                                            color="#093373"
                                                        />
                                                    )}
                                                </View>
                                            );
                                        }
                                    )}
                                </View>
                            </View>
                        )}
                </View>

                {/* ================================= */}

                {/* PRÓXIMA AULA */}

                {/* ================================= */}

                {proximaAula ? (
                    <View
                        style={
                            styles.secao
                        }
                    >
                        <Text
                            style={
                                styles.secaoTitulo
                            }
                        >
                            Próxima aula
                        </Text>

                        <AulaAlunoCard
                            aula={
                                proximaAula
                            }
                            destaque
                            cancelando={
                                cancelandoId ===
                                proximaAula.id
                            }
                            onRemarcar={() =>
                                abrirRemarcacao(
                                    proximaAula
                                )
                            }
                            onCancelar={() =>
                                confirmarCancelamento(
                                    proximaAula
                                )
                            }
                        />
                    </View>
                ) : (
                    <View
                        style={
                            styles.semAulaCard
                        }
                    >
                        <View
                            style={
                                styles.semAulaIcone
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                size={30}
                                color="#093373"
                            />
                        </View>

                        <Text
                            style={
                                styles.semAulaTitulo
                            }
                        >
                            Nenhuma aula
                            agendada
                        </Text>

                        <Text
                            style={
                                styles.semAulaTexto
                            }
                        >
                            Assim que um aluno
                            agendar uma aula
                            com você, ela
                            aparece aqui.
                        </Text>
                    </View>
                )}

                {/* ================================= */}

                {/* DEMAIS AULAS */}

                {/* ================================= */}

                {demaisAulas.length >
                    0 && (
                        <View
                            style={
                                styles.secao
                            }
                        >
                            <Text
                                style={
                                    styles.secaoTitulo
                                }
                            >
                                Demais aulas

                                <Text
                                    style={
                                        styles.secaoContador
                                    }
                                >
                                    {'  ·  '}
                                    {
                                        demaisAulas.length
                                    }
                                </Text>
                            </Text>

                            <View
                                style={
                                    styles.listaAulas
                                }
                            >
                                {demaisAulas.map(
                                    (aula) => (
                                        <AulaAlunoCard
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
                        </View>
                    )}
            </ScrollView>
        </SafeAreaView>
    );
}