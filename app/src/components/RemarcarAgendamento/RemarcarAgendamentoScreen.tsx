import { useAuth } from '@clerk/expo';
import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';
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
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './RemarcarAgendamentoScreen.styles';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

type DisponibilidadeAPI = {
    data: string;

    professor: {
        id: number;
        name: string;
        image?: string | null;
    };

    instrumento: {
        id: number;
        name: string;
    };

    nivel: {
        id: number;
        name: string;
    };

    horarios: string[];
};

type DiaDisponivel = {
    data: string;
    horarios: string[];
};

function formatarDataAtual(
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

function formatarDiaChip(
    dataString: string
) {
    const [ano, mes, dia] =
        dataString.split('-');

    const data = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia)
    );

    const diaSemana =
        data.toLocaleDateString(
            'pt-BR',
            {
                weekday: 'short',
            }
        );

    const diaNumero =
        String(
            data.getDate()
        ).padStart(2, '0');

    const mesCurto =
        data.toLocaleDateString(
            'pt-BR',
            {
                month: 'short',
            }
        );

    return {
        diaSemana:
            diaSemana
                .replace('.', '')
                .replace(/^./, (letra) =>
                    letra.toUpperCase()
                ),

        diaNumero,

        mes:
            mesCurto
                .replace('.', '')
                .replace(/^./, (letra) =>
                    letra.toUpperCase()
                ),
    };
}

export function RemarcarAgendamentoScreen() {
    const router = useRouter();

    const {
        getToken,
    } = useAuth();

    const {
        agendamentoId,
        professorId,
        instrumentoId,
        nivelId,
        professorNome,
        instrumentoNome,
        nivelNome,
        dataHoraAtual,
    } =
        useLocalSearchParams<{
            agendamentoId: string;
            professorId: string;
            instrumentoId: string;
            nivelId: string;
            professorNome: string;
            instrumentoNome: string;
            nivelNome: string;
            dataHoraAtual: string;
        }>();

    const [
        carregando,
        setCarregando,
    ] = useState(true);

    const [
        salvando,
        setSalvando,
    ] = useState(false);

    const [
        disponibilidades,
        setDisponibilidades,
    ] = useState<
        DiaDisponivel[]
    >([]);

    const [
        dataSelecionada,
        setDataSelecionada,
    ] = useState<
        string | null
    >(null);

    const [
        horarioSelecionado,
        setHorarioSelecionado,
    ] = useState<
        string | null
    >(null);

    const agendamentoAtual =
        useMemo(() => {
            if (
                !dataHoraAtual
            ) {
                return null;
            }

            return formatarDataAtual(
                dataHoraAtual
            );
        }, [
            dataHoraAtual,
        ]);

    const horariosDaDataSelecionada =
        useMemo(() => {
            if (
                !dataSelecionada
            ) {
                return [];
            }

            return (
                disponibilidades.find(
                    (item) =>
                        item.data ===
                        dataSelecionada
                )?.horarios ?? []
            );
        }, [
            dataSelecionada,
            disponibilidades,
        ]);

    useEffect(() => {
        carregarDisponibilidade();
    }, []);

    async function carregarDisponibilidade() {
        try {
            setCarregando(true);

            if (
                !agendamentoId ||
                !professorId ||
                !instrumentoId ||
                !nivelId
            ) {
                throw new Error(
                    'Dados do agendamento inválidos.'
                );
            }

            const token =
                await getToken();

            if (!token) {
                throw new Error(
                    'Sessão inválida.'
                );
            }

            const url =
                `${API_URL}/agendamento/disponibilidade` +
                `?instrumentoId=${encodeURIComponent(
                    instrumentoId
                )}` +
                `&nivelId=${encodeURIComponent(
                    nivelId
                )}` +
                `&professorId=${encodeURIComponent(
                    professorId
                )}`;

            const response =
                await fetch(
                    url,
                    {
                        method:
                            'GET',

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const dados =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    dados?.error ||
                    'Não foi possível buscar os horários disponíveis.'
                );
            }

            const lista: DisponibilidadeAPI[] =
                Array.isArray(
                    dados
                )
                    ? dados
                    : [];

            const mapa =
                new Map<
                    string,
                    Set<string>
                >();

            for (
                const item of lista
            ) {
                if (
                    item.professor?.id !==
                    Number(
                        professorId
                    )
                ) {
                    continue;
                }

                if (
                    item.instrumento?.id !==
                    Number(
                        instrumentoId
                    )
                ) {
                    continue;
                }

                if (
                    item.nivel?.id !==
                    Number(
                        nivelId
                    )
                ) {
                    continue;
                }

                if (
                    !item.data ||
                    !Array.isArray(
                        item.horarios
                    ) ||
                    item.horarios.length ===
                    0
                ) {
                    continue;
                }

                if (
                    !mapa.has(
                        item.data
                    )
                ) {
                    mapa.set(
                        item.data,
                        new Set()
                    );
                }

                const horarios =
                    mapa.get(
                        item.data
                    );

                if (!horarios) {
                    continue;
                }

                for (
                    const horario of item.horarios
                ) {
                    horarios.add(
                        horario
                    );
                }
            }

            const listaFormatada =
                Array.from(
                    mapa.entries()
                )
                    .map(
                        ([
                            data,
                            horarios,
                        ]) => ({
                            data,

                            horarios:
                                Array.from(
                                    horarios
                                ).sort(),
                        })
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.data.localeCompare(
                                b.data
                            )
                    );

            setDisponibilidades(
                listaFormatada
            );

            if (
                listaFormatada.length >
                0
            ) {
                setDataSelecionada(
                    listaFormatada[0]
                        .data
                );

                setHorarioSelecionado(
                    null
                );
            } else {
                setDataSelecionada(
                    null
                );

                setHorarioSelecionado(
                    null
                );
            }
        } catch (error) {
            console.error(
                'Erro ao carregar disponibilidade:',
                error
            );

            const mensagem =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar a disponibilidade.';

            Alert.alert(
                'Erro',
                mensagem
            );
        } finally {
            setCarregando(false);
        }
    }

    function selecionarData(
        data: string
    ) {
        setDataSelecionada(
            data
        );

        setHorarioSelecionado(
            null
        );
    }

    function confirmarRemarcacao() {
        if (
            !dataSelecionada ||
            !horarioSelecionado
        ) {
            Alert.alert(
                'Selecione um horário',
                'Escolha uma nova data e um novo horário para continuar.'
            );

            return;
        }

        const [ano, mes, dia] =
            dataSelecionada.split(
                '-'
            );

        Alert.alert(
            'Confirmar remarcação',
            `Deseja remarcar sua aula de ${instrumentoNome} para ${dia}/${mes}/${ano} às ${horarioSelecionado}?`,
            [
                {
                    text: 'Voltar',
                    style: 'cancel',
                },
                {
                    text: 'Remarcar',
                    onPress:
                        remarcarAgendamento,
                },
            ]
        );
    }

    async function remarcarAgendamento() {
        try {
            if (
                !dataSelecionada ||
                !horarioSelecionado
            ) {
                return;
            }

            setSalvando(
                true
            );

            const token =
                await getToken();

            if (!token) {
                throw new Error(
                    'Sessão inválida.'
                );
            }

            const response =
                await fetch(
                    `${API_URL}/agendamento/${agendamentoId}/remarcar`,
                    {
                        method:
                            'PATCH',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify(
                                {
                                    data:
                                        dataSelecionada,

                                    horario:
                                        horarioSelecionado,
                                }
                            ),
                    }
                );

            const dados =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    dados?.error ||
                    'Não foi possível remarcar a aula.'
                );
            }

            Alert.alert(
                'Aula remarcada',
                'Sua aula foi remarcada com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            router.replace(
                                '/home'
                            ),
                    },
                ]
            );
        } catch (error) {
            console.error(
                'Erro ao remarcar agendamento:',
                error
            );

            const mensagem =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível remarcar a aula.';

            Alert.alert(
                'Não foi possível remarcar',
                mensagem
            );

            await carregarDisponibilidade();
        } finally {
            setSalvando(
                false
            );
        }
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
                        Buscando horários
                        disponíveis...
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
            {/* HEADER */}

            <View
                style={
                    styles.header
                }
            >
                <TouchableOpacity
                    style={
                        styles.botaoVoltar
                    }
                    activeOpacity={
                        0.75
                    }
                    onPress={() =>
                        router.back()
                    }
                    disabled={
                        salvando
                    }
                >
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={28}
                        color="#093373"
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
                        Remarcar aula
                    </Text>

                    <Text
                        style={
                            styles.subtitulo
                        }
                    >
                        Escolha uma nova
                        data e horário
                    </Text>
                </View>

                <View
                    style={
                        styles.headerEspaco
                    }
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* DADOS DA AULA */}

                <View
                    style={
                        styles.cardResumo
                    }
                >
                    <View
                        style={
                            styles.resumoIcone
                        }
                    >
                        <MaterialCommunityIcons
                            name="music-note"
                            size={25}
                            color="#093373"
                        />
                    </View>

                    <View
                        style={
                            styles.resumoConteudo
                        }
                    >
                        <Text
                            style={
                                styles.resumoInstrumento
                            }
                        >
                            {
                                instrumentoNome
                            }
                        </Text>

                        <Text
                            style={
                                styles.resumoNivel
                            }
                        >
                            {nivelNome}
                        </Text>

                        <View
                            style={
                                styles.resumoProfessorLinha
                            }
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={16}
                                color="#6B7280"
                            />

                            <Text
                                style={
                                    styles.resumoProfessor
                                }
                            >
                                {
                                    professorNome
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* HORÁRIO ATUAL */}

                {agendamentoAtual && (
                    <View
                        style={
                            styles.cardAtual
                        }
                    >
                        <View
                            style={
                                styles.atualCabecalho
                            }
                        >
                            <View
                                style={
                                    styles.atualIcone
                                }
                            >
                                <MaterialCommunityIcons
                                    name="calendar-clock-outline"
                                    size={21}
                                    color="#B8842E"
                                />
                            </View>

                            <View>
                                <Text
                                    style={
                                        styles.atualLabel
                                    }
                                >
                                    HORÁRIO
                                    ATUAL
                                </Text>

                                <Text
                                    style={
                                        styles.atualTexto
                                    }
                                >
                                    {
                                        agendamentoAtual.data
                                    }{' '}
                                    às{' '}
                                    {
                                        agendamentoAtual.hora
                                    }
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={
                                styles.atualAviso
                            }
                        >
                            Selecione abaixo
                            uma nova data e
                            horário.
                        </Text>
                    </View>
                )}

                {/* DATA */}

                <View
                    style={
                        styles.secao
                    }
                >
                    <View
                        style={
                            styles.secaoTituloLinha
                        }
                    >
                        <View
                            style={
                                styles.numeroEtapa
                            }
                        >
                            <Text
                                style={
                                    styles.numeroEtapaTexto
                                }
                            >
                                1
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={
                                    styles.secaoTitulo
                                }
                            >
                                Escolha a nova
                                data
                            </Text>

                            <Text
                                style={
                                    styles.secaoSubtitulo
                                }
                            >
                                Datas disponíveis
                                nos próximos dias
                            </Text>
                        </View>
                    </View>

                    {disponibilidades.length >
                        0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                false
                            }
                            contentContainerStyle={
                                styles.listaDatas
                            }
                        >
                            {disponibilidades.map(
                                (item) => {
                                    const data =
                                        formatarDiaChip(
                                            item.data
                                        );

                                    const selecionado =
                                        dataSelecionada ===
                                        item.data;

                                    return (
                                        <TouchableOpacity
                                            key={
                                                item.data
                                            }
                                            activeOpacity={
                                                0.8
                                            }
                                            style={[
                                                styles.dataCard,

                                                selecionado &&
                                                styles.dataCardSelecionado,
                                            ]}
                                            onPress={() =>
                                                selecionarData(
                                                    item.data
                                                )
                                            }
                                            disabled={
                                                salvando
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.dataDiaSemana,

                                                    selecionado &&
                                                    styles.dataTextoSelecionado,
                                                ]}
                                            >
                                                {
                                                    data.diaSemana
                                                }
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.dataNumero,

                                                    selecionado &&
                                                    styles.dataTextoSelecionado,
                                                ]}
                                            >
                                                {
                                                    data.diaNumero
                                                }
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.dataMes,

                                                    selecionado &&
                                                    styles.dataTextoSelecionado,
                                                ]}
                                            >
                                                {
                                                    data.mes
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            )}
                        </ScrollView>
                    ) : (
                        <View
                            style={
                                styles.semDisponibilidade
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-remove-outline"
                                size={35}
                                color="#9CA3AF"
                            />

                            <Text
                                style={
                                    styles.semDisponibilidadeTitulo
                                }
                            >
                                Nenhuma data
                                disponível
                            </Text>

                            <Text
                                style={
                                    styles.semDisponibilidadeTexto
                                }
                            >
                                Este professor
                                não possui novos
                                horários
                                disponíveis no
                                momento.
                            </Text>

                            <TouchableOpacity
                                style={
                                    styles.botaoAtualizar
                                }
                                activeOpacity={
                                    0.8
                                }
                                onPress={
                                    carregarDisponibilidade
                                }
                            >
                                <MaterialCommunityIcons
                                    name="refresh"
                                    size={18}
                                    color="#093373"
                                />

                                <Text
                                    style={
                                        styles.botaoAtualizarTexto
                                    }
                                >
                                    Atualizar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* HORÁRIO */}

                {dataSelecionada &&
                    disponibilidades.length >
                    0 && (
                        <View
                            style={
                                styles.secao
                            }
                        >
                            <View
                                style={
                                    styles.secaoTituloLinha
                                }
                            >
                                <View
                                    style={
                                        styles.numeroEtapa
                                    }
                                >
                                    <Text
                                        style={
                                            styles.numeroEtapaTexto
                                        }
                                    >
                                        2
                                    </Text>
                                </View>

                                <View>
                                    <Text
                                        style={
                                            styles.secaoTitulo
                                        }
                                    >
                                        Escolha o
                                        horário
                                    </Text>

                                    <Text
                                        style={
                                            styles.secaoSubtitulo
                                        }
                                    >
                                        Horários
                                        realmente
                                        disponíveis
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.horariosGrid
                                }
                            >
                                {horariosDaDataSelecionada.map(
                                    (
                                        horario
                                    ) => {
                                        const selecionado =
                                            horarioSelecionado ===
                                            horario;

                                        return (
                                            <TouchableOpacity
                                                key={
                                                    horario
                                                }
                                                activeOpacity={
                                                    0.8
                                                }
                                                disabled={
                                                    salvando
                                                }
                                                style={[
                                                    styles.horarioCard,

                                                    selecionado &&
                                                    styles.horarioCardSelecionado,
                                                ]}
                                                onPress={() =>
                                                    setHorarioSelecionado(
                                                        horario
                                                    )
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="clock-outline"
                                                    size={19}
                                                    color={
                                                        selecionado
                                                            ? '#FFFFFF'
                                                            : '#093373'
                                                    }
                                                />

                                                <Text
                                                    style={[
                                                        styles.horarioTexto,

                                                        selecionado &&
                                                        styles.horarioTextoSelecionado,
                                                    ]}
                                                >
                                                    {
                                                        horario
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                )}
                            </View>
                        </View>
                    )}

                {/* CONFIRMAÇÃO */}

                {dataSelecionada &&
                    horarioSelecionado && (
                        <View
                            style={
                                styles.cardConfirmacao
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-check-outline"
                                size={24}
                                color="#093373"
                            />

                            <View
                                style={
                                    styles.confirmacaoTextoContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.confirmacaoLabel
                                    }
                                >
                                    NOVO HORÁRIO
                                </Text>

                                <Text
                                    style={
                                        styles.confirmacaoTexto
                                    }
                                >
                                    {(() => {
                                        const [
                                            ano,
                                            mes,
                                            dia,
                                        ] =
                                            dataSelecionada.split(
                                                '-'
                                            );

                                        return `${dia}/${mes}/${ano} às ${horarioSelecionado}`;
                                    })()}
                                </Text>
                            </View>
                        </View>
                    )}

                <View
                    style={
                        styles.espacoFinal
                    }
                />
            </ScrollView>

            {/* FOOTER */}

            <View
                style={
                    styles.footer
                }
            >
                <TouchableOpacity
                    activeOpacity={
                        0.85
                    }
                    disabled={
                        !dataSelecionada ||
                        !horarioSelecionado ||
                        salvando
                    }
                    style={[
                        styles.botaoConfirmar,

                        (!dataSelecionada ||
                            !horarioSelecionado ||
                            salvando) &&
                        styles.botaoConfirmarDesabilitado,
                    ]}
                    onPress={
                        confirmarRemarcacao
                    }
                >
                    {salvando ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="calendar-sync-outline"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.botaoConfirmarTexto
                                }
                            >
                                Confirmar
                                remarcação
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}