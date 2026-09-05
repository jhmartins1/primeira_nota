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
import { AgendamentoProfessor } from './types';

interface AulaAlunoCardProps {
    aula: AgendamentoProfessor;
    destaque?: boolean;
    cancelando?: boolean;
    onCancelar?: () => void;
}

export function AulaAlunoCard({
    aula,
    destaque = false,
    cancelando = false,
    onCancelar,
}: AulaAlunoCardProps) {
    const icone = getInstrumentIcon(
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

    function handleAbrirMapa() {
        if (linkMaps) {
            Linking.openURL(linkMaps);
        }
    }

    async function falarComAluno() {
        if (!aula.usuario.phone) {
            return;
        }

        const telefone =
            aula.usuario.phone.replace(
                /\D/g,
                ''
            );

        const telefoneWhatsApp =
            telefone.startsWith('55')
                ? telefone
                : `55${telefone}`;

        const primeiroNomeAluno =
            aula.usuario.name
                ?.trim()
                .split(/\s+/)[0] ??
            aula.usuario.name;

        const mensagem =
            `Olá, ${primeiroNomeAluno}! ` +
            `Sou seu professor no Primeira Nota e queria falar sobre nossa aula de ${aula.instrumento.name} ` +
            `no dia ${dataFormatada.data} às ${dataFormatada.hora}.`;

        const url =
            `https://wa.me/${telefoneWhatsApp}` +
            `?text=${encodeURIComponent(
                mensagem
            )}`;

        try {
            await Linking.openURL(url);
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
            {destaque && (
                <View
                    style={
                        styles.aulaCardBadge
                    }
                >
                    <MaterialCommunityIcons
                        name="star"
                        size={11}
                        color="#FFFFFF"
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

            {/* INSTRUMENTO */}

            <View
                style={styles.aulaTopo}
            >
                <View
                    style={styles.aulaIcone}
                >
                    {icone.familia ===
                        'material' ? (
                        <MaterialCommunityIcons
                            name={icone.nome}
                            size={24}
                            color="#093373"
                        />
                    ) : (
                        <FontAwesome5
                            name={icone.nome}
                            size={22}
                            color="#093373"
                        />
                    )}
                </View>

                <View
                    style={styles.aulaInfo}
                >
                    <Text
                        style={
                            styles.aulaInstrumento
                        }
                    >
                        {
                            aula.instrumento
                                .name
                        }
                    </Text>

                    <Text
                        style={
                            styles.aulaNivel
                        }
                    >
                        {aula.nivel.name}
                    </Text>
                </View>
            </View>

            {/* DETALHES */}

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
                        color="#6B7280"
                    />

                    <Text
                        style={
                            styles.aulaTexto
                        }
                    >
                        {dataFormatada.data}{' '}
                        às{' '}
                        {dataFormatada.hora}
                    </Text>
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
                        color="#6B7280"
                    />

                    <Text
                        style={
                            styles.aulaTexto
                        }
                    >
                        {aula.usuario.name}
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
                            color="#6B7280"
                        />

                        <Text
                            style={
                                styles.aulaTexto
                            }
                        >
                            {
                                aula.usuario
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
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* ENDEREÇO */}

                {enderecoTexto && (
                    <View
                        style={
                            styles.aulaLinha
                        }
                    >
                        <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={15}
                            color="#6B7280"
                        />

                        <Text
                            style={
                                styles.aulaTexto
                            }
                            numberOfLines={2}
                        >
                            {enderecoTexto}
                        </Text>
                    </View>
                )}
            </View>

            {/* MAPA */}

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
                        color="#FFFFFF"
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

            {/* CANCELAR */}

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
                            color="#B42318"
                        />
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="close-circle-outline"
                                size={16}
                                color="#B42318"
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