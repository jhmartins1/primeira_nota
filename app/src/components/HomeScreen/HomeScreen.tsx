import { useAuth } from '@clerk/expo';
import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './HomeScreen.styles';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

interface InstrumentoUsuario {
    instrumento: string;
    nivel: string;
}

interface Professor {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    image?: string | null;
}

interface Agendamento {
    id: number;
    usuarioId: number;
    professorId: number;
    instrumentoId: number;
    nivelId: number;
    dataHora: string;
    status:
    | 'AGENDADO'
    | 'CANCELADO'
    | 'CONCLUIDO';

    professor: Professor;

    instrumento: {
        id: number;
        name: string;
    };

    nivel: {
        id: number;
        name: string;
    };
}

interface Usuario {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    profileComplete: boolean;
    onboardingComplete: boolean;
    instrumentos: InstrumentoUsuario[];
}

function formatarDataBrasilia(
    dataHora: string
) {
    const data = new Date(dataHora);

    const brasilia = new Date(
        data.getTime() -
        3 * 60 * 60 * 1000
    );

    const dia = String(
        brasilia.getUTCDate()
    ).padStart(2, '0');

    const mes = String(
        brasilia.getUTCMonth() + 1
    ).padStart(2, '0');

    const ano =
        brasilia.getUTCFullYear();

    const hora = String(
        brasilia.getUTCHours()
    ).padStart(2, '0');

    const minuto = String(
        brasilia.getUTCMinutes()
    ).padStart(2, '0');

    return {
        data: `${dia}/${mes}/${ano}`,
        hora: `${hora}:${minuto}`,
    };
}

function formatarDiaSemana(
    dataHora: string
) {
    const data = new Date(dataHora);

    const brasilia = new Date(
        data.getTime() -
        3 * 60 * 60 * 1000
    );

    return brasilia
        .toLocaleDateString('pt-BR', {
            weekday: 'long',
            timeZone: 'UTC',
        })
        .replace(
            /^./,
            (letra) =>
                letra.toUpperCase()
        );
}

export default function HomeScreen() {
    const router = useRouter();

    const {
        getToken,
        signOut,
    } = useAuth();

    const [usuario, setUsuario] =
        useState<Usuario | null>(null);

    const [agendamentos, setAgendamentos] =
        useState<Agendamento[]>([]);

    const [carregando, setCarregando] =
        useState(true);

    const [atualizando, setAtualizando] =
        useState(false);

    const [cancelandoId, setCancelandoId] =
        useState<number | null>(null);

    const [erro, setErro] =
        useState<string | null>(null);

    const [saindo, setSaindo] =
        useState(false);

    const carregarDados = async (
        mostrarLoading = true
    ) => {
        try {
            if (!API_URL) {
                throw new Error(
                    'EXPO_PUBLIC_API_URL não configurada.'
                );
            }

            if (mostrarLoading) {
                setCarregando(true);
            } else {
                setAtualizando(true);
            }

            setErro(null);

            const token =
                await getToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }

            // ----------------------------------------------------
            // USUÁRIO
            // ----------------------------------------------------

            const usuarioResponse =
                await fetch(
                    `${API_URL}/usuario/me`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            'Content-Type':
                                'application/json',
                        },
                    }
                );

            if (!usuarioResponse.ok) {
                throw new Error(
                    `Erro ao buscar usuário: ${usuarioResponse.status}`
                );
            }

            const usuarioData =
                await usuarioResponse.json();

            setUsuario(usuarioData);

            // ----------------------------------------------------
            // AGENDAMENTOS
            // ----------------------------------------------------

            const agendamentosResponse =
                await fetch(
                    `${API_URL}/agendamento`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            'Content-Type':
                                'application/json',
                        },
                    }
                );

            if (
                !agendamentosResponse.ok
            ) {
                throw new Error(
                    `Erro ao buscar agendamentos: ${agendamentosResponse.status}`
                );
            }

            const agendamentosData =
                await agendamentosResponse.json();

            const lista: Agendamento[] =
                Array.isArray(
                    agendamentosData
                )
                    ? agendamentosData
                    : [];

            const futuros = lista
                .filter(
                    (item) =>
                        item.status ===
                        'AGENDADO' &&
                        new Date(
                            item.dataHora
                        ).getTime() >
                        Date.now()
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.dataHora
                        ).getTime() -
                        new Date(
                            b.dataHora
                        ).getTime()
                );

            setAgendamentos(
                futuros
            );
        } catch (error) {
            console.error(
                'Erro ao carregar Home:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar os dados.'
            );
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    async function atualizarTela() {
        await carregarDados(false);
    }

    const proximaAula =
        agendamentos.length > 0
            ? agendamentos[0]
            : null;

    const demaisAulas =
        agendamentos.slice(1, 4);

    // ============================================================
    // LOGOUT
    // ============================================================

    function confirmarLogout() {
        Alert.alert(
            'Sair da conta?',
            'Você será desconectado da sua conta.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress:
                        realizarLogout,
                },
            ]
        );
    }

    async function realizarLogout() {
        try {
            setSaindo(true);

            await signOut();

            // O AuthGuard do _layout.tsx
            // detectará que o usuário não está
            // mais autenticado e redirecionará
            // automaticamente para /login.
        } catch (error) {
            console.error(
                'Erro ao fazer logout:',
                error
            );

            Alert.alert(
                'Erro',
                'Não foi possível sair da conta. Tente novamente.'
            );
        } finally {
            setSaindo(false);
        }
    }

    // ============================================================
    // CANCELAR AULA
    // ============================================================

    function confirmarCancelamento(
        agendamento: Agendamento
    ) {
        const data =
            formatarDataBrasilia(
                agendamento.dataHora
            );

        Alert.alert(
            'Cancelar aula?',
            `Tem certeza que deseja cancelar sua aula de ${agendamento.instrumento.name} com ${agendamento.professor.name} em ${data.data} às ${data.hora}?`,
            [
                {
                    text: 'Voltar',
                    style: 'cancel',
                },
                {
                    text: 'Cancelar aula',
                    style: 'destructive',
                    onPress: () =>
                        cancelarAula(
                            agendamento
                        ),
                },
            ]
        );
    }

    async function cancelarAula(
        agendamento: Agendamento
    ) {
        try {
            setCancelandoId(
                agendamento.id
            );

            if (!API_URL) {
                throw new Error(
                    'EXPO_PUBLIC_API_URL não configurada.'
                );
            }

            const token =
                await getToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }

            const response =
                await fetch(
                    `${API_URL}/agendamento/${agendamento.id}/cancelar`,
                    {
                        method: 'PATCH',
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            'Content-Type':
                                'application/json',
                        },
                    }
                );

            const texto =
                await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível cancelar a aula.';

                try {
                    const erro =
                        JSON.parse(
                            texto
                        );

                    if (erro.error) {
                        mensagem =
                            erro.error;
                    }
                } catch { }

                throw new Error(
                    mensagem
                );
            }

            setAgendamentos(
                (listaAtual) =>
                    listaAtual.filter(
                        (item) =>
                            item.id !==
                            agendamento.id
                    )
            );

            Alert.alert(
                'Aula cancelada',
                'Sua aula foi cancelada com sucesso.'
            );

            await carregarDados(false);
        } catch (error) {
            console.error(
                'Erro ao cancelar aula:',
                error
            );

            Alert.alert(
                'Erro',
                error instanceof Error
                    ? error.message
                    : 'Não foi possível cancelar a aula.'
            );
        } finally {
            setCancelandoId(
                null
            );
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (carregando) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems:
                            'center',
                        justifyContent:
                            'center',
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

    // ============================================================
    // ERRO
    // ============================================================

    if (erro && !usuario) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems:
                            'center',
                        justifyContent:
                            'center',
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
                            fontWeight:
                                '800',
                            color:
                                '#1A1E29',
                            textAlign:
                                'center',
                        }}
                    >
                        Não foi possível
                        carregar
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 14,
                            lineHeight: 21,
                            color:
                                '#6B7280',
                            textAlign:
                                'center',
                        }}
                    >
                        {erro}
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            backgroundColor:
                                '#093373',
                            paddingHorizontal:
                                25,
                            paddingVertical:
                                13,
                            borderRadius:
                                12,
                        }}
                        onPress={() =>
                            carregarDados()
                        }
                    >
                        <Text
                            style={{
                                color:
                                    '#FFFFFF',
                                fontWeight:
                                    '700',
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
        <SafeAreaView
            style={styles.container}
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
                {/* HEADER */}

                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.eyebrow}>
                            PRIMEIRA NOTA
                        </Text>

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
                        style={[
                            styles.botaoLogout,
                            saindo && styles.botaoLogoutCarregando,
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
                                size={21}
                                color="#B42318"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* PRÓXIMA AULA */}

                {proximaAula ? (
                    <View
                        style={
                            styles.proximaAulaCard
                        }
                    >
                        <View
                            style={
                                styles.proximaAulaTopo
                            }
                        >
                            <Text
                                style={
                                    styles.proximaAulaLabel
                                }
                            >
                                PRÓXIMA AULA
                            </Text>

                            <View
                                style={
                                    styles.proximaAulaStatus
                                }
                            >
                                <View
                                    style={
                                        styles.statusPonto
                                    }
                                />

                                <Text
                                    style={
                                        styles.statusTexto
                                    }
                                >
                                    Agendada
                                </Text>
                            </View>
                        </View>

                        <View
                            style={
                                styles.proximaAulaConteudo
                            }
                        >
                            <View
                                style={
                                    styles.proximaAulaIcone
                                }
                            >
                                {(() => {
                                    const icone =
                                        getInstrumentIcon(
                                            proximaAula
                                                .instrumento
                                                .name
                                        );

                                    if (
                                        icone.familia ===
                                        'material'
                                    ) {
                                        return (
                                            <MaterialCommunityIcons
                                                name={
                                                    icone.nome
                                                }
                                                size={
                                                    31
                                                }
                                                color="#093373"
                                            />
                                        );
                                    }

                                    return (
                                        <FontAwesome5
                                            name={
                                                icone.nome
                                            }
                                            size={
                                                28
                                            }
                                            color="#093373"
                                        />
                                    );
                                })()}
                            </View>

                            <View
                                style={
                                    styles.proximaAulaInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.proximaAulaInstrumento
                                    }
                                >
                                    {
                                        proximaAula
                                            .instrumento
                                            .name
                                    }
                                </Text>

                                <View
                                    style={
                                        styles.proximaAulaNivel
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                '#B8842E',
                                            fontSize:
                                                12,
                                            fontWeight:
                                                '800',
                                        }}
                                    >
                                        ★
                                    </Text>

                                    <Text
                                        style={
                                            styles.proximaAulaNivelTexto
                                        }
                                    >
                                        {
                                            proximaAula
                                                .nivel
                                                .name
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={
                                styles.proximaAulaDetalhes
                            }
                        >
                            <View
                                style={
                                    styles.detalheItem
                                }
                            >
                                <MaterialCommunityIcons
                                    name="calendar-outline"
                                    size={19}
                                    color="#093373"
                                />

                                <View>
                                    <Text
                                        style={
                                            styles.detalheLabel
                                        }
                                    >
                                        Data
                                    </Text>

                                    <Text
                                        style={
                                            styles.detalheValor
                                        }
                                    >
                                        {
                                            formatarDataBrasilia(
                                                proximaAula.dataHora
                                            ).data
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.detalheSubvalor
                                        }
                                    >
                                        {formatarDiaSemana(
                                            proximaAula.dataHora
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.detalheItem
                                }
                            >
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={19}
                                    color="#093373"
                                />

                                <View>
                                    <Text
                                        style={
                                            styles.detalheLabel
                                        }
                                    >
                                        Horário
                                    </Text>

                                    <Text
                                        style={
                                            styles.detalheValor
                                        }
                                    >
                                        {
                                            formatarDataBrasilia(
                                                proximaAula.dataHora
                                            ).hora
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.detalheSubvalor
                                        }
                                    >
                                        1 hora
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={
                                styles.professorContainer
                            }
                        >
                            <View
                                style={
                                    styles.professorIcone
                                }
                            >
                                {proximaAula
                                    .professor
                                    .image ? (
                                    <Image
                                        source={{
                                            uri: proximaAula
                                                .professor
                                                .image,
                                        }}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius:
                                                19,
                                        }}
                                    />
                                ) : (
                                    <FontAwesome5
                                        name="user"
                                        size={17}
                                        color="#093373"
                                    />
                                )}
                            </View>

                            <View
                                style={
                                    styles.professorInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.detalheLabel
                                    }
                                >
                                    Professor
                                </Text>

                                <Text
                                    style={
                                        styles.professorNome
                                    }
                                >
                                    {
                                        proximaAula
                                            .professor
                                            .name
                                    }
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={
                                styles.botaoDetalhes
                            }
                            activeOpacity={0.85}
                            onPress={() =>
                                Alert.alert(
                                    'Aula',
                                    `${proximaAula.instrumento.name} com ${proximaAula.professor.name}\n${formatarDataBrasilia(proximaAula.dataHora).data} às ${formatarDataBrasilia(proximaAula.dataHora).hora}`
                                )
                            }
                        >
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={18}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.botaoDetalhesTexto
                                }
                            >
                                Ver detalhes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: 44,
                                marginTop: 9,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor:
                                    '#E5E7EB',
                                backgroundColor:
                                    '#FFFFFF',
                                flexDirection:
                                    'row',
                                alignItems:
                                    'center',
                                justifyContent:
                                    'center',
                                gap: 7,
                            }}
                            activeOpacity={0.8}
                            disabled={
                                cancelandoId ===
                                proximaAula.id
                            }
                            onPress={() =>
                                confirmarCancelamento(
                                    proximaAula
                                )
                            }
                        >
                            {cancelandoId ===
                                proximaAula.id ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#B42318"
                                />
                            ) : (
                                <>
                                    <MaterialCommunityIcons
                                        name="calendar-remove-outline"
                                        size={18}
                                        color="#B42318"
                                    />

                                    <Text
                                        style={{
                                            fontSize:
                                                13,
                                            fontWeight:
                                                '700',
                                            color:
                                                '#B42318',
                                        }}
                                    >
                                        Cancelar aula
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
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
                                name="calendar-plus"
                                size={30}
                                color="#093373"
                            />
                        </View>

                        <Text
                            style={
                                styles.semAulaTitulo
                            }
                        >
                            Você não tem aulas
                            agendadas
                        </Text>

                        <Text
                            style={
                                styles.semAulaTexto
                            }
                        >
                            Agende uma aula e
                            comece sua próxima
                            evolução musical.
                        </Text>
                    </View>
                )}

                {/* BOTÃO AGENDAR */}

                <TouchableOpacity
                    style={
                        styles.botaoAgendar
                    }
                    activeOpacity={0.85}
                    onPress={() =>
                        router.push(
                            '/agendamento'
                        )
                    }
                >
                    <View
                        style={
                            styles.botaoAgendarIcone
                        }
                    >
                        <MaterialCommunityIcons
                            name="calendar-plus"
                            size={24}
                            color="#093373"
                        />
                    </View>

                    <View
                        style={
                            styles.botaoAgendarInfo
                        }
                    >
                        <Text
                            style={
                                styles.botaoAgendarTitulo
                            }
                        >
                            Agendar nova aula
                        </Text>

                        <Text
                            style={
                                styles.botaoAgendarSubtitulo
                            }
                        >
                            Escolha instrumento,
                            professor, dia e
                            horário
                        </Text>
                    </View>

                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                {/* MINHAS AULAS */}

                <View
                    style={
                        styles.secao
                    }
                >
                    <View
                        style={
                            styles.secaoHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.secaoTitulo
                                }
                            >
                                Minhas aulas
                            </Text>

                            <Text
                                style={
                                    styles.secaoSubtitulo
                                }
                            >
                                Próximos
                                agendamentos
                            </Text>
                        </View>

                        {agendamentos.length >
                            3 && (
                                <Text
                                    style={
                                        styles.verTodas
                                    }
                                >
                                    Ver todas
                                </Text>
                            )}
                    </View>

                    {demaisAulas.length >
                        0 ? (
                        <View
                            style={
                                styles.listaAulas
                            }
                        >
                            {demaisAulas.map(
                                (
                                    aula
                                ) => (
                                    <View
                                        key={
                                            aula.id
                                        }
                                        style={
                                            styles.aulaCard
                                        }
                                    >
                                        <View
                                            style={
                                                styles.aulaTopo
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.aulaIcone
                                                }
                                            >
                                                {(() => {
                                                    const icone =
                                                        getInstrumentIcon(
                                                            aula
                                                                .instrumento
                                                                .name
                                                        );

                                                    if (
                                                        icone.familia ===
                                                        'material'
                                                    ) {
                                                        return (
                                                            <MaterialCommunityIcons
                                                                name={
                                                                    icone.nome
                                                                }
                                                                size={
                                                                    24
                                                                }
                                                                color="#093373"
                                                            />
                                                        );
                                                    }

                                                    return (
                                                        <FontAwesome5
                                                            name={
                                                                icone.nome
                                                            }
                                                            size={
                                                                22
                                                            }
                                                            color="#093373"
                                                        />
                                                    );
                                                })()}
                                            </View>

                                            <View
                                                style={
                                                    styles.aulaInfo
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.aulaInstrumento
                                                    }
                                                >
                                                    {
                                                        aula
                                                            .instrumento
                                                            .name
                                                    }
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={
                                                styles.aulaDetalhes
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.aulaDataLinha
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="calendar-outline"
                                                    size={
                                                        15
                                                    }
                                                    color="#6B7280"
                                                />

                                                <Text
                                                    style={
                                                        styles.aulaData
                                                    }
                                                >
                                                    {
                                                        formatarDataBrasilia(
                                                            aula.dataHora
                                                        ).data
                                                    }{' '}
                                                    às{' '}
                                                    {
                                                        formatarDataBrasilia(
                                                            aula.dataHora
                                                        ).hora
                                                    }
                                                </Text>
                                            </View>

                                            <View
                                                style={
                                                    styles.aulaProfessorLinha
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="account-outline"
                                                    size={
                                                        15
                                                    }
                                                    color="#6B7280"
                                                />

                                                <Text
                                                    style={
                                                        styles.aulaProfessor
                                                    }
                                                >
                                                    {
                                                        aula
                                                            .professor
                                                            .name
                                                    }
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={
                                                styles.botaoCancelarAula
                                            }
                                            activeOpacity={
                                                0.8
                                            }
                                            disabled={
                                                cancelandoId ===
                                                aula.id
                                            }
                                            onPress={() =>
                                                confirmarCancelamento(
                                                    aula
                                                )
                                            }
                                        >
                                            {cancelandoId ===
                                                aula.id ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#B42318"
                                                />
                                            ) : (
                                                <>
                                                    <MaterialCommunityIcons
                                                        name="calendar-remove-outline"
                                                        size={
                                                            17
                                                        }
                                                        color="#B42318"
                                                    />

                                                    <Text
                                                        style={
                                                            styles.botaoCancelarAulaTexto
                                                        }
                                                    >
                                                        Cancelar aula
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )
                            )}
                        </View>
                    ) : (
                        <View
                            style={{
                                backgroundColor:
                                    '#FFFFFF',
                                borderRadius:
                                    16,
                                borderWidth:
                                    1,
                                borderColor:
                                    '#E7EAF0',
                                padding: 18,
                                alignItems:
                                    'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:
                                        13,
                                    color:
                                        '#6B7280',
                                }}
                            >
                                Nenhuma outra aula
                                agendada.
                            </Text>
                        </View>
                    )}
                </View>

                {/* MEUS INSTRUMENTOS */}

                <View
                    style={
                        styles.secao
                    }
                >
                    <View
                        style={
                            styles.secaoHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.secaoTitulo
                                }
                            >
                                Meus instrumentos
                            </Text>

                            <Text
                                style={
                                    styles.secaoSubtitulo
                                }
                            >
                                Seus níveis
                                atuais
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={
                                styles.botaoEditarInstrumentos
                            }
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push({
                                    pathname:
                                        '/instrument',
                                    params: {
                                        modoEdicao:
                                            'true',
                                    },
                                })
                            }
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
                    </View>

                    {usuario?.instrumentos
                        ?.length ? (
                        <View
                            style={
                                styles.instrumentosLista
                            }
                        >
                            {usuario.instrumentos.map(
                                (
                                    instrumento,
                                    index
                                ) => {
                                    const icone =
                                        getInstrumentIcon(
                                            instrumento.instrumento
                                        );

                                    return (
                                        <TouchableOpacity
                                            key={`${instrumento.instrumento}-${index}`}
                                            style={
                                                styles.instrumentoCard
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
                                            <View
                                                style={
                                                    styles.instrumentoIcone
                                                }
                                            >
                                                {icone.familia ===
                                                    'material' ? (
                                                    <MaterialCommunityIcons
                                                        name={
                                                            icone.nome
                                                        }
                                                        size={
                                                            25
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

                                            <View
                                                style={
                                                    styles.instrumentoInfo
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.instrumentoNome
                                                    }
                                                >
                                                    {
                                                        instrumento.instrumento
                                                    }
                                                </Text>

                                                <View
                                                    style={
                                                        styles.instrumentoNivel
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color:
                                                                '#B8842E',
                                                            fontSize:
                                                                12,
                                                        }}
                                                    >
                                                        ★
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.instrumentoNivelTexto
                                                        }
                                                    >
                                                        {
                                                            instrumento.nivel
                                                        }
                                                    </Text>
                                                </View>
                                            </View>

                                            <MaterialCommunityIcons
                                                name="chevron-right"
                                                size={
                                                    22
                                                }
                                                color="#093373"
                                            />
                                        </TouchableOpacity>
                                    );
                                }
                            )}
                        </View>
                    ) : (
                        <View
                            style={
                                styles.instrumentosVazio
                            }
                        >
                            <Text
                                style={
                                    styles.instrumentosVazioTexto
                                }
                            >
                                Você ainda não
                                possui instrumentos
                                cadastrados.
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        '/instrument'
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.instrumentosVazioLink
                                    }
                                >
                                    Adicionar
                                    instrumento
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
