import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { formatarDataBrasilia } from './formatters';
import { styles } from './HomeScreen.styles';
import { Agendamento } from './types';

interface AulaCardProps {
    aula: Agendamento;
    cancelando: boolean;
    onCancelar: () => void;
}

export function AulaCard({ aula, cancelando, onCancelar }: AulaCardProps) {
    const icone = getInstrumentIcon(aula.instrumento.name);
    const dataFormatada = formatarDataBrasilia(aula.dataHora);

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

            <View style={styles.aulaDetalhes}>
                <View style={styles.aulaDataLinha}>
                    <MaterialCommunityIcons name="calendar-outline" size={15} color="#6B7280" />
                    <Text style={styles.aulaData}>
                        {dataFormatada.data} às {dataFormatada.hora}
                    </Text>
                </View>

                <View style={styles.aulaProfessorLinha}>
                    <MaterialCommunityIcons name="account-outline" size={15} color="#6B7280" />
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