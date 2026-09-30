import { colors } from '../../theme/colors';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
    styles,
} from './DisponibilidadeScreen.styles';

// ----------------------------------------------------
// HORÁRIOS RÁPIDOS
//
// Eles NÃO são mais uma limitação.
// São apenas atalhos visuais para o professor.
// ----------------------------------------------------

const HORARIOS_PADRAO = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
];

interface NovoHorarioModalProps {
    visivel: boolean;
    salvando: boolean;
    onFechar: () => void;

    onSalvar: (
        data: Date,
        horarios: string[],
        repetirSeteDiasUteis: boolean
    ) => Promise<boolean>;
}

export function NovoHorarioModal({
    visivel,
    salvando,
    onFechar,
    onSalvar,
}: NovoHorarioModalProps) {
    const insets =
        useSafeAreaInsets();

    const [
        data,
        setData,
    ] =
        useState(
            new Date()
        );

    const [
        horariosSelecionados,
        setHorariosSelecionados,
    ] =
        useState<string[]>(
            []
        );

    const [
        horariosPersonalizados,
        setHorariosPersonalizados,
    ] =
        useState<string[]>(
            []
        );

    const [
        repetirSeteDiasUteis,
        setRepetirSeteDiasUteis,
    ] =
        useState(false);

    const [
        mostrarData,
        setMostrarData,
    ] =
        useState(false);

    const [
        mostrarHorario,
        setMostrarHorario,
    ] =
        useState(false);

    const [
        horarioTemporario,
        setHorarioTemporario,
    ] =
        useState(
            criarHorarioInicial()
        );

    // ----------------------------------------------------
    // TODOS OS HORÁRIOS MOSTRADOS
    //
    // Presets + personalizados.
    // Remove duplicados e ordena.
    // ----------------------------------------------------

    const horariosDisponiveis =
        useMemo(
            () =>
                Array.from(
                    new Set([
                        ...HORARIOS_PADRAO,
                        ...horariosPersonalizados,
                    ])
                ).sort(),
            [
                horariosPersonalizados,
            ]
        );

    const todosSelecionados =
        horariosDisponiveis.length >
        0 &&
        horariosDisponiveis.every(
            (horario) =>
                horariosSelecionados.includes(
                    horario
                )
        );

    // ----------------------------------------------------
    // RESETAR AO ABRIR
    // ----------------------------------------------------

    useEffect(() => {
        if (!visivel) {
            return;
        }

        setData(
            new Date()
        );

        setHorariosSelecionados(
            []
        );

        setHorariosPersonalizados(
            []
        );

        setRepetirSeteDiasUteis(
            false
        );

        setMostrarData(
            false
        );

        setMostrarHorario(
            false
        );

        setHorarioTemporario(
            criarHorarioInicial()
        );
    }, [visivel]);

    // ----------------------------------------------------
    // SELECIONAR / DESSELECIONAR
    // ----------------------------------------------------

    function alternarHorario(
        horario: string
    ) {
        setHorariosSelecionados(
            (atuais) => {
                if (
                    atuais.includes(
                        horario
                    )
                ) {
                    return atuais.filter(
                        (item) =>
                            item !==
                            horario
                    );
                }

                return ordenarHorarios([
                    ...atuais,
                    horario,
                ]);
            }
        );
    }

    // ----------------------------------------------------
    // MARCAR TODOS
    // ----------------------------------------------------

    function alternarTodos() {
        if (
            todosSelecionados
        ) {
            setHorariosSelecionados(
                []
            );

            return;
        }

        setHorariosSelecionados(
            [...horariosDisponiveis]
        );
    }

    // ----------------------------------------------------
    // ADICIONAR HORÁRIO PERSONALIZADO
    // ----------------------------------------------------

    function adicionarHorarioPersonalizado(
        dataHorario: Date
    ) {
        const horario =
            formatarHorario(
                dataHorario
            );

        // Se já for um horário padrão ou personalizado,
        // apenas selecionamos.
        if (
            horariosDisponiveis.includes(
                horario
            )
        ) {
            setHorariosSelecionados(
                (atuais) => {
                    if (
                        atuais.includes(
                            horario
                        )
                    ) {
                        return atuais;
                    }

                    return ordenarHorarios([
                        ...atuais,
                        horario,
                    ]);
                }
            );

            setMostrarHorario(
                false
            );

            return;
        }

        setHorariosPersonalizados(
            (atuais) =>
                ordenarHorarios([
                    ...atuais,
                    horario,
                ])
        );

        // Ao adicionar um horário personalizado,
        // ele já fica selecionado.
        setHorariosSelecionados(
            (atuais) =>
                ordenarHorarios([
                    ...atuais,
                    horario,
                ])
        );

        setMostrarHorario(
            false
        );
    }

    // ----------------------------------------------------
    // REMOVER HORÁRIO PERSONALIZADO
    // ----------------------------------------------------

    function removerHorarioPersonalizado(
        horario: string
    ) {
        setHorariosPersonalizados(
            (atuais) =>
                atuais.filter(
                    (item) =>
                        item !==
                        horario
                )
        );

        setHorariosSelecionados(
            (atuais) =>
                atuais.filter(
                    (item) =>
                        item !==
                        horario
                )
        );
    }

    // ----------------------------------------------------
    // DATE TIME PICKER DE HORÁRIO
    // ----------------------------------------------------

    function handleAlterarHorario(
        event: DateTimePickerEvent,
        novoHorario?: Date
    ) {
        if (
            Platform.OS ===
            'android'
        ) {
            setMostrarHorario(
                false
            );

            if (
                event.type ===
                'dismissed'
            ) {
                return;
            }

            if (
                novoHorario
            ) {
                setHorarioTemporario(
                    novoHorario
                );

                adicionarHorarioPersonalizado(
                    novoHorario
                );
            }

            return;
        }

        if (
            novoHorario
        ) {
            setHorarioTemporario(
                novoHorario
            );
        }
    }

    // ----------------------------------------------------
    // SALVAR
    // ----------------------------------------------------

    async function handleSalvar() {
        if (
            horariosSelecionados.length ===
            0
        ) {
            return;
        }

        const horariosOrdenados =
            ordenarHorarios(
                horariosSelecionados
            );

        const sucesso =
            await onSalvar(
                data,
                horariosOrdenados,
                repetirSeteDiasUteis
            );

        if (sucesso) {
            onFechar();
        }
    }

    const quantidadeDias =
        repetirSeteDiasUteis
            ? 7
            : 1;

    const quantidadeHorarios =
        horariosSelecionados.length *
        quantidadeDias;

    return (
        <Modal
            visible={visivel}
            transparent
            animationType="slide"
            onRequestClose={
                onFechar
            }
        >
            <View
                style={
                    styles.modalFundo
                }
            >
                <View
                    style={
                        styles.modalConteudo
                    }
                >
                    <View
                        style={
                            styles.modalHandle
                        }
                    />

                    <Text
                        style={
                            styles.modalTitulo
                        }
                    >
                        Adicionar horários
                    </Text>

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={[
                            styles.modalScrollContent,

                            {
                                paddingBottom:
                                    Math.max(
                                        insets.bottom,
                                        16
                                    ) +
                                    20,
                            },
                        ]}
                    >
                        {/* DATA */}

                        <Text
                            style={
                                styles.campoLabel
                            }
                        >
                            Data inicial
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.campoValor
                            }
                            activeOpacity={
                                0.8
                            }
                            onPress={() =>
                                setMostrarData(
                                    true
                                )
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-outline"
                                size={18}
                                color={
                                    colors.navy
                                }
                            />

                            <Text
                                style={
                                    styles.campoValorTexto
                                }
                            >
                                {data.toLocaleDateString(
                                    'pt-BR'
                                )}
                            </Text>
                        </TouchableOpacity>

                        {mostrarData && (
                            <DateTimePicker
                                value={
                                    data
                                }
                                mode="date"
                                display={
                                    Platform.OS ===
                                        'ios'
                                        ? 'inline'
                                        : 'default'
                                }
                                minimumDate={
                                    new Date()
                                }
                                onChange={(
                                    _,
                                    novaData
                                ) => {
                                    setMostrarData(
                                        Platform.OS ===
                                        'ios'
                                    );

                                    if (
                                        novaData
                                    ) {
                                        setData(
                                            novaData
                                        );
                                    }
                                }}
                            />
                        )}

                        {/* HORÁRIOS */}

                        <View
                            style={
                                styles.horariosCabecalho
                            }
                        >
                            <Text
                                style={
                                    styles.campoLabel
                                }
                            >
                                Horários da aula
                            </Text>

                            <TouchableOpacity
                                activeOpacity={
                                    0.7
                                }
                                onPress={
                                    alternarTodos
                                }
                            >
                                <Text
                                    style={
                                        styles.marcarTodosTexto
                                    }
                                >
                                    {todosSelecionados
                                        ? 'Desmarcar todos'
                                        : 'Marcar todos'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* HORÁRIOS PADRÃO */}

                        <View
                            style={
                                styles.horariosGrade
                            }
                        >
                            {HORARIOS_PADRAO.map(
                                (
                                    horario
                                ) => {
                                    const selecionado =
                                        horariosSelecionados.includes(
                                            horario
                                        );

                                    return (
                                        <TouchableOpacity
                                            key={
                                                horario
                                            }
                                            style={[
                                                styles.horarioOpcao,

                                                selecionado &&
                                                styles.horarioOpcaoSelecionado,
                                            ]}
                                            activeOpacity={
                                                0.8
                                            }
                                            onPress={() =>
                                                alternarHorario(
                                                    horario
                                                )
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.checkbox,

                                                    selecionado &&
                                                    styles.checkboxSelecionado,
                                                ]}
                                            >
                                                {selecionado && (
                                                    <MaterialCommunityIcons
                                                        name="check"
                                                        size={
                                                            14
                                                        }
                                                        color={
                                                            colors.surface
                                                        }
                                                    />
                                                )}
                                            </View>

                                            <Text
                                                style={[
                                                    styles.horarioOpcaoTexto,

                                                    selecionado &&
                                                    styles.horarioOpcaoTextoSelecionado,
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

                        {/* HORÁRIOS PERSONALIZADOS */}

                        {horariosPersonalizados.length >
                            0 && (
                                <>
                                    <Text
                                        style={
                                            styles.horariosPersonalizadosTitulo
                                        }
                                    >
                                        Horários personalizados
                                    </Text>

                                    <View
                                        style={
                                            styles.horariosGrade
                                        }
                                    >
                                        {horariosPersonalizados.map(
                                            (
                                                horario
                                            ) => {
                                                const selecionado =
                                                    horariosSelecionados.includes(
                                                        horario
                                                    );

                                                return (
                                                    <View
                                                        key={
                                                            horario
                                                        }
                                                        style={[
                                                            styles.horarioPersonalizadoContainer,

                                                            selecionado &&
                                                            styles.horarioPersonalizadoContainerSelecionado,
                                                        ]}
                                                    >
                                                        <TouchableOpacity
                                                            style={
                                                                styles.horarioPersonalizadoSelecionar
                                                            }
                                                            activeOpacity={
                                                                0.8
                                                            }
                                                            onPress={() =>
                                                                alternarHorario(
                                                                    horario
                                                                )
                                                            }
                                                        >
                                                            <MaterialCommunityIcons
                                                                name={
                                                                    selecionado
                                                                        ? 'check-circle'
                                                                        : 'clock-outline'
                                                                }
                                                                size={
                                                                    17
                                                                }
                                                                color={
                                                                    selecionado
                                                                        ? colors.teal
                                                                        : colors.navy
                                                                }
                                                            />

                                                            <Text
                                                                style={
                                                                    styles.horarioPersonalizadoTexto
                                                                }
                                                            >
                                                                {
                                                                    horario
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={
                                                                styles.horarioPersonalizadoRemover
                                                            }
                                                            activeOpacity={
                                                                0.7
                                                            }
                                                            onPress={() =>
                                                                removerHorarioPersonalizado(
                                                                    horario
                                                                )
                                                            }
                                                        >
                                                            <MaterialCommunityIcons
                                                                name="close"
                                                                size={
                                                                    16
                                                                }
                                                                color={
                                                                    colors.danger
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }
                                        )}
                                    </View>
                                </>
                            )}

                        {/* ADICIONAR OUTRO HORÁRIO */}

                        <TouchableOpacity
                            style={
                                styles.botaoHorarioPersonalizado
                            }
                            activeOpacity={
                                0.8
                            }
                            onPress={() => {
                                setHorarioTemporario(
                                    criarHorarioInicial()
                                );

                                setMostrarHorario(
                                    true
                                );
                            }}
                        >
                            <MaterialCommunityIcons
                                name="clock-plus-outline"
                                size={20}
                                color={
                                    colors.teal
                                }
                            />

                            <Text
                                style={
                                    styles.botaoHorarioPersonalizadoTexto
                                }
                            >
                                Adicionar outro horário
                            </Text>
                        </TouchableOpacity>

                        {/* PICKER DO HORÁRIO */}

                        {mostrarHorario && (
                            <View
                                style={
                                    styles.pickerHorarioContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.pickerHorarioTitulo
                                    }
                                >
                                    Escolha o horário de início
                                </Text>

                                <DateTimePicker
                                    value={
                                        horarioTemporario
                                    }
                                    mode="time"
                                    is24Hour
                                    minuteInterval={
                                        1
                                    }
                                    display={
                                        Platform.OS ===
                                            'ios'
                                            ? 'spinner'
                                            : 'default'
                                    }
                                    onChange={
                                        handleAlterarHorario
                                    }
                                />

                                {Platform.OS ===
                                    'ios' && (
                                        <View
                                            style={
                                                styles.pickerHorarioAcoes
                                            }
                                        >
                                            <TouchableOpacity
                                                style={
                                                    styles.botaoCancelarHorario
                                                }
                                                activeOpacity={
                                                    0.8
                                                }
                                                onPress={() =>
                                                    setMostrarHorario(
                                                        false
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.botaoCancelarHorarioTexto
                                                    }
                                                >
                                                    Cancelar
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={
                                                    styles.botaoConfirmarHorario
                                                }
                                                activeOpacity={
                                                    0.8
                                                }
                                                onPress={() =>
                                                    adicionarHorarioPersonalizado(
                                                        horarioTemporario
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.botaoConfirmarHorarioTexto
                                                    }
                                                >
                                                    Adicionar
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                            </View>
                        )}

                        <Text
                            style={
                                styles.infoAula
                            }
                        >
                            Selecione os horários de início em que você estará disponível.
                        </Text>

                        {/* REPETIÇÃO */}

                        <Text
                            style={
                                styles.campoLabel
                            }
                        >
                            Repetição
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.repeticaoOpcao,

                                !repetirSeteDiasUteis &&
                                styles.repeticaoOpcaoSelecionada,
                            ]}
                            activeOpacity={
                                0.8
                            }
                            onPress={() =>
                                setRepetirSeteDiasUteis(
                                    false
                                )
                            }
                        >
                            <View
                                style={[
                                    styles.radio,

                                    !repetirSeteDiasUteis &&
                                    styles.radioSelecionado,
                                ]}
                            >
                                {!repetirSeteDiasUteis && (
                                    <View
                                        style={
                                            styles.radioCentro
                                        }
                                    />
                                )}
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.repeticaoTitulo
                                    }
                                >
                                    Somente este dia
                                </Text>

                                <Text
                                    style={
                                        styles.repeticaoDescricao
                                    }
                                >
                                    Adiciona os horários apenas na data selecionada.
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.repeticaoOpcao,

                                repetirSeteDiasUteis &&
                                styles.repeticaoOpcaoSelecionada,
                            ]}
                            activeOpacity={
                                0.8
                            }
                            onPress={() =>
                                setRepetirSeteDiasUteis(
                                    true
                                )
                            }
                        >
                            <View
                                style={[
                                    styles.radio,

                                    repetirSeteDiasUteis &&
                                    styles.radioSelecionado,
                                ]}
                            >
                                {repetirSeteDiasUteis && (
                                    <View
                                        style={
                                            styles.radioCentro
                                        }
                                    />
                                )}
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.repeticaoTitulo
                                    }
                                >
                                    Próximos 7 dias úteis
                                </Text>

                                <Text
                                    style={
                                        styles.repeticaoDescricao
                                    }
                                >
                                    Repete os horários selecionados de segunda a sexta-feira.
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* RESUMO */}

                        {horariosSelecionados.length >
                            0 && (
                                <View
                                    style={
                                        styles.resumoCriacao
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="information-outline"
                                        size={18}
                                        color={
                                            colors.navy
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.resumoCriacaoTexto
                                        }
                                    >
                                        Serão adicionados até{' '}
                                        {
                                            quantidadeHorarios
                                        }{' '}
                                        horários.
                                    </Text>
                                </View>
                            )}

                        {/* SALVAR */}

                        <TouchableOpacity
                            style={[
                                styles.botaoSalvar,

                                horariosSelecionados.length ===
                                0 &&
                                styles.botaoSalvarDesabilitado,
                            ]}
                            activeOpacity={
                                0.85
                            }
                            onPress={
                                handleSalvar
                            }
                            disabled={
                                salvando ||
                                horariosSelecionados.length ===
                                0
                            }
                        >
                            {salvando ? (
                                <ActivityIndicator
                                    color={
                                        colors.surface
                                    }
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.botaoSalvarTexto
                                    }
                                >
                                    Adicionar horários
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* CANCELAR */}

                        <TouchableOpacity
                            style={
                                styles.botaoCancelarModal
                            }
                            activeOpacity={
                                0.7
                            }
                            onPress={
                                onFechar
                            }
                            disabled={
                                salvando
                            }
                        >
                            <Text
                                style={
                                    styles.botaoCancelarModalTexto
                                }
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// ============================================================
// HELPERS
// ============================================================

function criarHorarioInicial() {
    const agora =
        new Date();

    agora.setSeconds(
        0,
        0
    );

    return agora;
}

function formatarHorario(
    data: Date
) {
    const hora =
        String(
            data.getHours()
        ).padStart(
            2,
            '0'
        );

    const minuto =
        String(
            data.getMinutes()
        ).padStart(
            2,
            '0'
        );

    return `${hora}:${minuto}`;
}

function ordenarHorarios(
    horarios: string[]
) {
    return Array.from(
        new Set(
            horarios
        )
    ).sort(
        (a, b) =>
            a.localeCompare(
                b
            )
    );
}