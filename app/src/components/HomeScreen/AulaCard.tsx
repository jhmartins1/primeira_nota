import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { formatarDataBrasilia, formatarDiaSemana } from './formatters';
import { styles } from './HomeScreen.styles';
import { Agendamento } from './types';

interface AulaCardProps {
    aula: Agendamento;
    cancelando: boolean;
    onCancelar: () => void;
}

function obterIniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/);

    const primeira = partes[0]?.[0] ?? '';
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';

    return (primeira + ultima).toUpperCase();
}

export function AulaCard({ aula, cancelando, onCancelar }: AulaCardProps) {
    const icone = getInstrumentIcon(aula.instrumento.name);
    const dataFormatada = formatarDataBrasilia(aula.dataHora);
    const diaSemana = formatarDiaSemana(aula.dataHora);

    return (
        <View style={styles.aulaCard}>
            <View style={styles.aulaTopo}>
                <View style={styles.aulaIcone}>
                    {icone.familia === 'material' ? (
                        <MaterialCommunityIcons name={icone.nome} size={24} color="#093373" />
                    ) : (
                        <FontAwesome5 name={icone.nome} size={22} color="#093373" />
                    )}
                </View>

                <View style={styles.aulaInfo}>
                    <Text style={styles.aulaInstrumento}>{aula.instrumento.name}</Text>
                </View>
            </View>

            <View style={styles.aulaDataChip}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color="#093373" />

                <Text style={styles.aulaDataChipTexto}>
                    {dataFormatada.data}{' '}
                    <Text style={styles.aulaDataChipDia}>({diaSemana})</Text>{' '}
                    às {dataFormatada.hora}
                </Text>
            </View>

            <View style={styles.aulaDetalhes}>
                <View style={styles.aulaProfessorLinha}>
                    {aula.professor.image ? (
                        <Image
                            source={{ uri: aula.professor.image }}
                            style={styles.professorAvatarPequeno}
                        />
                    ) : (
                        <View style={styles.professorAvatarPequenoFallback}>
                            <Text style={styles.professorAvatarPequenoIniciais}>
                                {obterIniciais(aula.professor.name)}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.aulaProfessor}>{aula.professor.name}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.botaoCancelarAula}
                activeOpacity={0.8}
                disabled={cancelando}
                onPress={onCancelar}
            >
                {cancelando ? (
                    <ActivityIndicator size="small" color="#B42318" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="calendar-remove-outline" size={17} color="#B42318" />
                        <Text style={styles.botaoCancelarAulaTexto}>Cancelar aula</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}