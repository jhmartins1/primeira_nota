import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { getCorNivel } from '../../constants/NivelColors';
import { formatarDataBrasilia } from '../HomeScreen/formatters';

import { styles } from './ProfessorHomeScreen.styles';
import { AgendamentoProfessor } from './types';

const FUSO_BRASILIA = 'America/Sao_Paulo';

function formatarDiaSemana(dataHora: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: FUSO_BRASILIA,
        weekday: 'long',
    }).format(new Date(dataHora));
}

function obterIniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/);

    const primeira = partes[0]?.[0] ?? '';
    const ultima =
        partes.length > 1
            ? partes[partes.length - 1][0]
            : '';

    return (primeira + ultima).toUpperCase();
}

interface AulaAlunoCardProps {
    aula: AgendamentoProfessor;
    cancelando: boolean;
    onCancelar: () => void;
    destaque?: boolean;
}

export function AulaAlunoCard({
    aula,
    cancelando,
    onCancelar,
    destaque = false,
}: AulaAlunoCardProps) {
    const icone = getInstrumentIcon(
        aula.instrumento.name
    );

    const dataFormatada =
        formatarDataBrasilia(aula.dataHora);

    const diaSemana = formatarDiaSemana(aula.dataHora);

    const corNivel = getCorNivel(aula.nivel.name);

    return (
        <View
            style={[
                styles.aulaCard,
                destaque && styles.aulaCardDestaque,
            ]}
        >
            {destaque && (
                <View style={styles.aulaCardBadge}>
                    <MaterialCommunityIcons
                        name="star-four-points"
                        size={11}
                        color="#FFFFFF"
                    />
                    <Text style={styles.aulaCardBadgeTexto}>
                        PRÓXIMA
                    </Text>
                </View>
            )}

            <View style={styles.aulaTopo}>
                <View style={styles.aulaIcone}>
                    {icone.familia === 'material' ? (
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

                <View style={styles.aulaInfo}>
                    <Text style={styles.aulaInstrumento}>
                        {aula.instrumento.name}
                    </Text>

                    <Text
                        style={[
                            styles.aulaNivel,
                            {
                                color: corNivel.cor,
                                backgroundColor: corNivel.fundo,
                            },
                        ]}
                    >
                        {aula.nivel.name}
                    </Text>
                </View>
            </View>

            <View style={styles.aulaDataChip}>
                <MaterialCommunityIcons
                    name="calendar-outline"
                    size={16}
                    color="#093373"
                />

                <Text style={styles.aulaDataChipTexto}>
                    {dataFormatada.data}{' '}
                    <Text style={styles.aulaDataChipDia}>
                        ({diaSemana})
                    </Text>{' '}
                    às {dataFormatada.hora}
                </Text>
            </View>

            <View style={styles.aulaDetalhes}>
                <View style={styles.alunoLinha}>
                    {aula.usuario.image ? (
                        <Image
                            source={{ uri: aula.usuario.image }}
                            style={styles.alunoAvatar}
                        />
                    ) : (
                        <View style={styles.alunoAvatarFallback}>
                            <Text style={styles.alunoAvatarIniciais}>
                                {obterIniciais(aula.usuario.name)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.alunoInfo}>
                        <Text style={styles.alunoNome}>
                            {aula.usuario.name}
                        </Text>

                        {aula.usuario.phone && (
                            <View style={styles.alunoTelefoneLinha}>
                                <MaterialCommunityIcons
                                    name="phone-outline"
                                    size={13}
                                    color="#6B7280"
                                />
                                <Text style={styles.alunoTelefone}>
                                    {aula.usuario.phone}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.botaoCancelarAula}
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