import {
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

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import { useState } from 'react';

import { styles } from './DisponibilidadeScreen.styles';
import { NovoHorarioModal } from './NovoHorarioModal';
import { DisponibilidadeProfessor } from './types';
import { useDisponibilidade } from './useDisponibilidade';

function agruparPorDia(
    lista:
        DisponibilidadeProfessor[]
) {
    const grupos =
        new Map<
            string,
            DisponibilidadeProfessor[]
        >();

    for (
        const item
        of lista
    ) {
        const chave =
            new Date(
                item.horaInicio
            ).toLocaleDateString(
                'en-CA',
                {
                    timeZone:
                        'America/Sao_Paulo',
                }
            );

        if (
            !grupos.has(
                chave
            )
        ) {
            grupos.set(
                chave,
                []
            );
        }

        grupos
            .get(chave)!
            .push(item);
    }

    return Array.from(
        grupos.entries()
    ).map(
        ([
            chave,
            itens,
        ]) => {
            const data =
                new Date(
                    `${chave}T12:00:00-03:00`
                );

            return {
                chave,

                dataLabel:
                    data.toLocaleDateString(
                        'pt-BR',
                        {
                            weekday:
                                'long',

                            day:
                                '2-digit',

                            month:
                                'long',

                            timeZone:
                                'America/Sao_Paulo',
                        }
                    ),

                itens,
            };
        }
    );
}

function formatarHora(
    iso: string
) {
    return new Date(
        iso
    ).toLocaleTimeString(
        'pt-BR',
        {
            hour:
                '2-digit',

            minute:
                '2-digit',

            timeZone:
                'America/Sao_Paulo',
        }
    );
}

export default function DisponibilidadeScreen() {
    const router =
        useRouter();

    const {
        disponibilidades,
        carregando,
        salvando,
        removendoId,
        removendoDia,
        carregarDisponibilidades,
        criarDisponibilidade,
        confirmarRemocao,
        confirmarRemocaoDia,
    } =
        useDisponibilidade();

    const [
        modalVisivel,
        setModalVisivel,
    ] =
        useState(false);

    const grupos =
        agruparPorDia(
            disponibilidades
        );

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
                            carregando
                        }

                        onRefresh={
                            carregarDisponibilidades
                        }

                        tintColor="#093373"
                    />
                }
            >
                <View
                    style={
                        styles.header
                    }
                >
                    <TouchableOpacity
                        onPress={() =>
                            router.back()
                        }
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={22}
                            color="#093373"
                        />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.eyebrow,

                            {
                                marginTop:
                                    14,
                            },
                        ]}
                    >
                        PRIMEIRA NOTA · PROFESSOR
                    </Text>

                    <Text
                        style={
                            styles.titulo
                        }
                    >
                        Seus horários
                    </Text>

                    <Text
                        style={
                            styles.subtitulo
                        }
                    >
                        Adicione os dias e horários em que você pode atender. Os alunos verão apenas os horários disponíveis.
                    </Text>
                </View>

                {carregando &&
                    disponibilidades.length ===
                    0 ? (
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                        style={{
                            marginTop:
                                30,
                        }}
                    />
                ) : grupos.length ===
                    0 ? (
                    <View
                        style={
                            styles.vazioCard
                        }
                    >
                        <View
                            style={
                                styles.vazioIcone
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                size={
                                    30
                                }
                                color="#093373"
                            />
                        </View>

                        <Text
                            style={
                                styles.vazioTitulo
                            }
                        >
                            Nenhum horário cadastrado
                        </Text>

                        <Text
                            style={
                                styles.vazioTexto
                            }
                        >
                            Toque em "Adicionar horário" para começar a disponibilizar horários para os alunos.
                        </Text>
                    </View>
                ) : (
                    grupos.map(
                        (grupo) => (
                            <View
                                key={
                                    grupo.chave
                                }

                                style={
                                    styles.grupo
                                }
                            >
                                <View
                                    style={
                                        styles.grupoCabecalho
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.grupoTitulo,

                                            {
                                                marginBottom:
                                                    0,

                                                flex:
                                                    1,
                                            },
                                        ]}
                                    >
                                        {
                                            grupo.dataLabel
                                        }
                                    </Text>

                                    <TouchableOpacity
                                        style={
                                            styles.botaoApagarDia
                                        }

                                        activeOpacity={
                                            0.8
                                        }

                                        disabled={
                                            removendoDia ===
                                            grupo.chave
                                        }

                                        onPress={() =>
                                            confirmarRemocaoDia(
                                                grupo.chave,
                                                grupo.dataLabel
                                            )
                                        }
                                    >
                                        {removendoDia ===
                                            grupo.chave ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#B42318"
                                            />
                                        ) : (
                                            <>
                                                <MaterialCommunityIcons
                                                    name="trash-can-outline"
                                                    size={
                                                        15
                                                    }
                                                    color="#B42318"
                                                />

                                                <Text
                                                    style={
                                                        styles.botaoApagarDiaTexto
                                                    }
                                                >
                                                    Apagar dia
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {grupo.itens.map(
                                    (
                                        item
                                    ) => (
                                        <View
                                            key={
                                                item.id
                                            }

                                            style={
                                                styles.horarioCard
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.horarioIcone
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name="clock-outline"
                                                    size={
                                                        18
                                                    }
                                                    color="#093373"
                                                />
                                            </View>

                                            <Text
                                                style={[
                                                    styles.horarioTexto,

                                                    {
                                                        flex:
                                                            1,
                                                    },
                                                ]}
                                            >
                                                {formatarHora(
                                                    item.horaInicio
                                                )}{' '}
                                                às{' '}
                                                {formatarHora(
                                                    item.horaFim
                                                )}
                                            </Text>

                                            <TouchableOpacity
                                                style={
                                                    styles.botaoRemover
                                                }

                                                activeOpacity={
                                                    0.8
                                                }

                                                onPress={() =>
                                                    confirmarRemocao(
                                                        item
                                                    )
                                                }

                                                disabled={
                                                    removendoId ===
                                                    item.id
                                                }
                                            >
                                                {removendoId ===
                                                    item.id ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#B42318"
                                                    />
                                                ) : (
                                                    <MaterialCommunityIcons
                                                        name="trash-can-outline"
                                                        size={
                                                            17
                                                        }
                                                        color="#B42318"
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )}
                            </View>
                        )
                    )
                )}
            </ScrollView>

            <TouchableOpacity
                style={
                    styles.botaoAdicionar
                }

                activeOpacity={
                    0.85
                }

                onPress={() =>
                    setModalVisivel(
                        true
                    )
                }
            >
                <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color="#FFFFFF"
                />

                <Text
                    style={
                        styles.botaoAdicionarTexto
                    }
                >
                    Adicionar horário
                </Text>
            </TouchableOpacity>

            <NovoHorarioModal
                visivel={
                    modalVisivel
                }

                salvando={
                    salvando
                }

                onFechar={() =>
                    setModalVisivel(
                        false
                    )
                }

                onSalvar={
                    criarDisponibilidade
                }
            />
        </SafeAreaView>
    );
}