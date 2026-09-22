import { colors } from '../../theme/colors';
import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    ActivityIndicator,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';

import {
    formatarEnderecoCompleto,
    gerarLinkGoogleMaps,
} from '../../utils/endereco';

import { formatarDataBrasilia } from '../HomeScreen/formatters';

import { styles } from './ProfessorHomeScreen.styles';

import {
    AgendamentoProfessor,
} from './types';

interface AulaAlunoCardProps {
    aula: AgendamentoProfessor;

    destaque?: boolean;

    cancelando?: boolean;

    onRemarcar?: () => void;

    onCancelar?: () => void;
}

export function AulaAlunoCard({
    aula,
    destaque = false,
    cancelando = false,
    onRemarcar,
    onCancelar,
}: AulaAlunoCardProps) {
    const icone =
        getInstrumentIcon(
            aula.instrumento.name
        );

    const dataFormatada =
        formatarDataBrasilia(
            aula.dataHora
        );

    const enderecoTexto =
        formatarEnderecoCompleto(
            aula.usuario
        );

    const linkMaps =
        gerarLinkGoogleMaps(
            aula.usuario
        );

    // MAPA
    function handleAbrirMapa() {
        if (linkMaps) {
            Linking.openURL(
                linkMaps
            );
        }
    }

    // WHATSAPP
    async function falarComAluno() {
        if (
            !aula.usuario.phone
        ) {
            return;
        }

        const telefone =
            aula.usuario.phone.replace(
                /\D/g,
                ''
            );

        const telefoneWhatsApp =
            telefone.startsWith(
                '55'
            )
                ? telefone
                : `55${telefone}`;

        const primeiroNomeAluno =
            aula.usuario.name
                ?.trim()
                .split(/\s+/)[0] ??
            aula.usuario.name;

        const mensagem =
            `Olá, ${primeiroNomeAluno}! ` +
            `Sou seu professor no Tocaê e queria falar sobre nossa aula de ${aula.instrumento.name} ` +
            `no dia ${dataFormatada.data} às ${dataFormatada.hora}.`;

        const url =
            `https://wa.me/${telefoneWhatsApp}` +
            `?text=${encodeURIComponent(
                mensagem
            )}`;

        try {
            await Linking.openURL(
                url
            );
        } catch (error) {
            console.error(
                'Erro ao abrir WhatsApp:',
                error
            );
        }
    }

    return (
        <View
            style={[
                styles.aulaCard,

                destaque &&
                styles.aulaCardDestaque,
            ]}
        >
            {/* BADGE */}

            {destaque && (
                <View
                    style={
                        styles.aulaCardBadge
                    }
                >
                    <MaterialCommunityIcons
                        name="star"
                        size={11}
                        color={colors.surface}
                    />

                    <Text
                        style={
                            styles.aulaCardBadgeTexto
                        }
                    >
                        PRÓXIMA
                    </Text>
                </View>
            )}
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
                    {icone.familia ===
                        'material' ? (
                        <MaterialCommunityIcons
                            name={
                                icone.nome
                            }
                            size={24}
                            color={colors.navy}
                        />
                    ) : (
                        <FontAwesome5
                            name={
                                icone.nome
                            }
                            size={22}
                            color={colors.navy}
                        />
                    )}
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

                    <Text
                        style={
                            styles.aulaNivel
                        }
                    >
                        {
                            aula
                                .nivel
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
                {/* DATA */}

                <View
                    style={
                        styles.aulaLinha
                    }
                >
                    <MaterialCommunityIcons
                        name="calendar-outline"
                        size={15}
                        color={colors.textSecondary}
                    />

                    <Text
                        style={
                            styles.aulaTexto
                        }
                    >
                        {
                            dataFormatada.data
                        }{' '}
                        às{' '}
                        {
                            dataFormatada.hora
                        }
                    </Text>
                </View>

                {/* POSSUI O INSTRUMENTO */}

                <View style={styles.aulaLinha}>
                    <MaterialCommunityIcons
                        name="music-note-outline"
                        size={15}
                        color={colors.textSecondary}
                    />

                    <View
                        style={
                            styles.possuiInstrumentoLinha
                        }
                    >
                        <Text
                            style={
                                styles.possuiInstrumentoLabel
                            }
                        >
                            Possui{' '}
                            {aula.instrumento.name}:
                        </Text>

                        <View
                            style={[
                                styles.possuiInstrumentoBadge,

                                aula.possuiInstrumento
                                    ? styles.possuiInstrumentoSim
                                    : styles.possuiInstrumentoNao,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={
                                    aula.possuiInstrumento
                                        ? 'check-circle-outline'
                                        : 'close-circle-outline'
                                }
                                size={14}
                                color={
                                    aula.possuiInstrumento
                                        ? colors.success
                                        : colors.danger
                                }
                            />

                            <Text
                                style={[
                                    styles.possuiInstrumentoTexto,

                                    aula.possuiInstrumento
                                        ? styles.possuiInstrumentoTextoSim
                                        : styles.possuiInstrumentoTextoNao,
                                ]}
                            >
                                {aula.possuiInstrumento
                                    ? 'Sim'
                                    : 'Não'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ALUNO */}

                <View
                    style={
                        styles.aulaLinha
                    }
                >
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={15}
                        color={colors.textSecondary}
                    />

                    <Text
                        style={
                            styles.aulaTexto
                        }
                    >
                        {
                            aula.usuario
                                .name
                        }
                    </Text>
                </View>

                {/* TELEFONE + WHATSAPP */}

                {aula.usuario.phone && (
                    <View
                        style={
                            styles.aulaLinha
                        }
                    >
                        <MaterialCommunityIcons
                            name="phone-outline"
                            size={15}
                            color={colors.textSecondary}
                        />

                        <Text
                            style={
                                styles.aulaTexto
                            }
                        >
                            {
                                aula
                                    .usuario
                                    .phone
                            }
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.botaoWhatsAppAluno
                            }
                            activeOpacity={
                                0.75
                            }
                            onPress={
                                falarComAluno
                            }
                        >
                            <FontAwesome5
                                name="whatsapp"
                                size={15}
                                color={colors.surface}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {enderecoTexto && (
                    <View
                        style={
                            styles.aulaLinha
                        }
                    >
                        <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={15}
                            color={colors.textSecondary}
                        />

                        <Text
                            style={
                                styles.aulaTexto
                            }
                            numberOfLines={
                                2
                            }
                        >
                            {
                                enderecoTexto
                            }
                        </Text>
                    </View>
                )}
            </View>

            {linkMaps && (
                <TouchableOpacity
                    style={
                        styles.botaoVerEndereco
                    }
                    activeOpacity={
                        0.85
                    }
                    onPress={
                        handleAbrirMapa
                    }
                >
                    <MaterialCommunityIcons
                        name="map-marker-radius-outline"
                        size={16}
                        color={colors.surface}
                    />

                    <Text
                        style={
                            styles.botaoVerEnderecoTexto
                        }
                    >
                        Ver endereço no
                        mapa
                    </Text>
                </TouchableOpacity>
            )}

            {onRemarcar && (
                <TouchableOpacity
                    style={
                        styles.botaoRemarcarAula
                    }
                    activeOpacity={
                        0.85
                    }
                    onPress={
                        onRemarcar
                    }
                    disabled={
                        cancelando
                    }
                >
                    <MaterialCommunityIcons
                        name="calendar-sync-outline"
                        size={17}
                        color={colors.navy}
                    />

                    <Text
                        style={
                            styles.botaoRemarcarAulaTexto
                        }
                    >
                        Remarcar aula
                    </Text>
                </TouchableOpacity>
            )}
            {onCancelar && (
                <TouchableOpacity
                    style={
                        styles.botaoCancelarAula
                    }
                    activeOpacity={
                        0.85
                    }
                    onPress={
                        onCancelar
                    }
                    disabled={
                        cancelando
                    }
                >
                    {cancelando ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.danger}
                        />
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="close-circle-outline"
                                size={
                                    16
                                }
                                color={colors.danger}
                            />

                            <Text
                                style={
                                    styles.botaoCancelarAulaTexto
                                }
                            >
                                Cancelar
                                aula
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}