import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { styles } from './DisponibilidadeScreen.styles';

const HORARIOS = [
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
    const [data, setData] = useState(new Date());

    const [
        horariosSelecionados,
        setHorariosSelecionados,
    ] = useState<string[]>([]);

    const [
        repetirSeteDiasUteis,
        setRepetirSeteDiasUteis,
    ] = useState(false);

    const [mostrarData, setMostrarData] =
        useState(false);

    const todosSelecionados =
        horariosSelecionados.length ===
        HORARIOS.length;

    useEffect(() => {
        if (!visivel) {
            return;
        }

        setData(new Date());
        setHorariosSelecionados([]);
        setRepetirSeteDiasUteis(false);
        setMostrarData(false);
    }, [visivel]);

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
                            item !== horario
                    );
                }

                return [
                    ...atuais,
                    horario,
                ];
            }
        );
    }

    function alternarTodos() {
        if (todosSelecionados) {
            setHorariosSelecionados([]);
            return;
        }

        setHorariosSelecionados([
            ...HORARIOS,
        ]);
    }

    async function handleSalvar() {
        if (
            horariosSelecionados.length ===
            0
        ) {
            return;
        }

        const sucesso =
            await onSalvar(
                data,
                horariosSelecionados,
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
            onRequestClose={onFechar}
        >
            <View
                style={styles.modalFundo}
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
                    >
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
                            activeOpacity={0.8}
                            onPress={() =>
                                setMostrarData(
                                    true
                                )
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-outline"
                                size={18}
                                color="#093373"
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
                                value={data}
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

                        <View
                            style={
                                styles.horariosGrade
                            }
                        >
                            {HORARIOS.map(
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
                                            activeOpacity={
                                                0.8
                                            }
                                            style={[
                                                styles.horarioOpcao,
                                                selecionado &&
                                                styles.horarioOpcaoSelecionado,
                                            ]}
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
                                                            15
                                                        }
                                                        color="#FFFFFF"
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

                        <Text
                            style={
                                styles.infoAula
                            }
                        >
                            Cada aula tem duração de 1 hora.
                        </Text>

                        <Text
                            style={
                                styles.campoLabel
                            }
                        >
                            Repetir
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

                        {horariosSelecionados.length >
                            0 && (
                                <View
                                    style={
                                        styles.resumoCriacao
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="information-outline"
                                        size={
                                            18
                                        }
                                        color="#093373"
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
                                    color="#FFFFFF"
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