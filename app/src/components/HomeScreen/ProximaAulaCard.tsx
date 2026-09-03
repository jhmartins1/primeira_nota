import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { getCorNivel } from '../../constants/NivelColors';
import { formatarDataBrasilia, formatarDiaSemana } from './formatters';
import { styles } from './HomeScreen.styles';
import { Agendamento } from './types';

interface ProximaAulaCardProps {
    aula: Agendamento;
    cancelando: boolean;
    onCancelar: () => void;
}

export function ProximaAulaCard({ aula, cancelando, onCancelar }: ProximaAulaCardProps) {
    const icone = getInstrumentIcon(aula.instrumento.name);
    const dataFormatada = formatarDataBrasilia(aula.dataHora);
    const corNivel = getCorNivel(aula.nivel.name);

    function verDetalhes() {
        Alert.alert(
            'Aula',
            `${aula.instrumento.name} com ${aula.professor.name}\n${dataFormatada.data} às ${dataFormatada.hora}`
        );
    }

    return (
        <View style={styles.proximaAulaCard}>
            <View style={styles.proximaAulaTopo}>
                <Text style={styles.proximaAulaLabel}>PRÓXIMA AULA</Text>

                <View style={styles.proximaAulaStatus}>
                    <View style={styles.statusPonto} />
                    <Text style={styles.statusTexto}>Agendada</Text>
                </View>
            </View>

            <View style={styles.proximaAulaConteudo}>
                <View style={styles.proximaAulaIcone}>
                    {icone.familia === 'material' ? (
                        <MaterialCommunityIcons name={icone.nome} size={31} color="#093373" />
                    ) : (
                        <FontAwesome5 name={icone.nome} size={28} color="#093373" />
                    )}
                </View>

                <View style={styles.proximaAulaInfo}>
                    <Text style={styles.proximaAulaInstrumento}>{aula.instrumento.name}</Text>

                    <View style={[styles.proximaAulaNivel, { backgroundColor: corNivel.fundo }]}>
                        <Text style={{ color: corNivel.cor, fontSize: 12, fontWeight: '800' }}>★</Text>
                        <Text style={[styles.proximaAulaNivelTexto, { color: corNivel.cor }]}>
                            {aula.nivel.name}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.proximaAulaDetalhes}>
                <View style={styles.detalheItem}>
                    <MaterialCommunityIcons name="calendar-outline" size={19} color="#093373" />
                    <View>
                        <Text style={styles.detalheLabel}>Data</Text>
                        <Text style={styles.detalheValor}>{dataFormatada.data}</Text>
                        <Text style={styles.detalheSubvalor}>{formatarDiaSemana(aula.dataHora)}</Text>
                    </View>
                </View>

                <View style={styles.detalheItem}>
                    <MaterialCommunityIcons name="clock-outline" size={19} color="#093373" />
                    <View>
                        <Text style={styles.detalheLabel}>Horário</Text>
                        <Text style={styles.detalheValor}>{dataFormatada.hora}</Text>
                        <Text style={styles.detalheSubvalor}>1 hora</Text>
                    </View>
                </View>
            </View>

            <View style={styles.professorContainer}>
                <View style={styles.professorIcone}>
                    {aula.professor.image ? (
                        <Image
                            source={{ uri: aula.professor.image }}
                            style={{ width: 38, height: 38, borderRadius: 19 }}
                        />
                    ) : (
                        <FontAwesome5 name="user" size={17} color="#093373" />
                    )}
                </View>

                <View style={styles.professorInfo}>
                    <Text style={styles.detalheLabel}>Professor</Text>
                    <Text style={styles.professorNome}>{aula.professor.name}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.botaoDetalhes} activeOpacity={0.85} onPress={verDetalhes}>
                <MaterialCommunityIcons name="information-outline" size={18} color="#FFFFFF" />
                <Text style={styles.botaoDetalhesTexto}>Ver detalhes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    height: 44,
                    marginTop: 9,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                }}
                activeOpacity={0.8}
                disabled={cancelando}
                onPress={onCancelar}
            >
                {cancelando ? (
                    <ActivityIndicator size="small" color="#B42318" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="calendar-remove-outline" size={18} color="#B42318" />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#B42318' }}>
                            Cancelar aula
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}