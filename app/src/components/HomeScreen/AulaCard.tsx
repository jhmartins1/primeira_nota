import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    ActivityIndicator,
    Image,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import {
    formatarDataBrasilia,
    formatarDiaSemana,
} from './formatters';
import { styles } from './HomeScreen.styles';
import { Agendamento } from './types';

interface AulaCardProps {
    aula: Agendamento;
    cancelando: boolean;
    onCancelar: () => void;
    onRemarcar: () => void;
}

function obterIniciais(
    nome: string
): string {
    const partes =
        nome.trim().split(/\s+/);

    const primeira =
        partes[0]?.[0] ?? '';

    const ultima =
        partes.length > 1
            ? partes[
            partes.length - 1
            ][0]
            : '';

    return (
        primeira + ultima
    ).toUpperCase();
}

export function AulaCard({
    aula,
    cancelando,
    onCancelar,
    onRemarcar,
}: AulaCardProps) {
    const icone = getInstrumentIcon(
        aula.instrumento.name
    );

    const dataFormatada =
        formatarDataBrasilia(
            aula.dataHora
        );

    const diaSemana =
        formatarDiaSemana(
            aula.dataHora
        );

    async function falarComProfessor() {
        if (!aula.professor.phone) {
            return;
        }

        const telefone =
            aula.professor.phone.replace(
                /\D/g,
                ''
            );

        const telefoneWhatsApp =
            telefone.startsWith('55')
                ? telefone
                : `55${telefone}`;

        const primeiroNome =
            aula.professor.name
                ?.trim()
                .split(/\s+/)[0] ??
            aula.professor.name;

        const mensagem =
            `Olá, professor ${primeiroNome}! ` +
            `Sou seu aluno no Primeira Nota e queria falar sobre nossa aula de ${aula.instrumento.name} ` +
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
        <View style={styles.aulaCard}>
            <View
                style={styles.aulaTopo}
            >
                <View
                    style={
                        styles.aulaIcone
                    }
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
                </View>
            </View>

            <View
                style={
                    styles.aulaDataChip
                }
            >
                <MaterialCommunityIcons
                    name="calendar-outline"
                    size={16}
                    color="#093373"
                />

                <Text
                    style={
                        styles.aulaDataChipTexto
                    }
                >
                    {dataFormatada.data}{' '}

                    <Text
                        style={
                            styles.aulaDataChipDia
                        }
                    >
                        ({diaSemana})
                    </Text>{' '}

                    às {dataFormatada.hora}
                </Text>
            </View>

            <View
                style={
                    styles.aulaDetalhes
                }
            >
                <View
                    style={
                        styles.aulaProfessorLinha
                    }
                >
                    {aula.professor
                        .image ? (
                        <Image
                            source={{
                                uri: aula
                                    .professor
                                    .image,
                            }}
                            style={
                                styles.professorAvatarPequeno
                            }
                        />
                    ) : (
                        <View
                            style={
                                styles.professorAvatarPequenoFallback
                            }
                        >
                            <Text
                                style={
                                    styles.professorAvatarPequenoIniciais
                                }
                            >
                                {obterIniciais(
                                    aula
                                        .professor
                                        .name
                                )}
                            </Text>
                        </View>
                    )}

                    <Text
                        style={
                            styles.aulaProfessor
                        }
                    >
                        {
                            aula.professor
                                .name
                        }
                    </Text>
                </View>
            </View>

            {aula.professor.phone && (
                <TouchableOpacity
                    style={
                        styles.botaoWhatsApp
                    }
                    activeOpacity={0.85}
                    onPress={
                        falarComProfessor
                    }
                >
                    <FontAwesome5
                        name="whatsapp"
                        size={17}
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            styles.botaoWhatsAppTexto
                        }
                    >
                        Falar com professor
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.botaoRemarcarAula}
                activeOpacity={0.8}
                disabled={cancelando}
                onPress={onRemarcar}
            >
                <MaterialCommunityIcons
                    name="calendar-sync-outline"
                    size={18}
                    color="#093373"
                />

                <Text
                    style={
                        styles.botaoRemarcarAulaTexto
                    }
                >
                    Remarcar aula
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={
                    styles.botaoCancelarAula
                }
                activeOpacity={0.8}
                disabled={cancelando}
                onPress={onCancelar}
            >
                {cancelando ? (
                    <ActivityIndicator
                        size="small"
                        color="#B42318"
                    />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="calendar-remove-outline"
                            size={17}
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
    );
}