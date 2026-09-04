import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { formatarEnderecoCompleto, gerarLinkGoogleMaps } from '../../utils/endereco';
import { formatarDataBrasilia } from '../HomeScreen/formatters';
import { styles } from './ProfessorHomeScreen.styles';
import { AgendamentoProfessor } from './types';

interface AulaAlunoCardProps {
    aula: AgendamentoProfessor;
}

export function AulaAlunoCard({ aula }: AulaAlunoCardProps) {
    const icone = getInstrumentIcon(aula.instrumento.name);
    const dataFormatada = formatarDataBrasilia(aula.dataHora);

    const enderecoTexto = formatarEnderecoCompleto(aula.usuario);
    const linkMaps = gerarLinkGoogleMaps(aula.usuario);

    function handleAbrirMapa() {
        if (linkMaps) {
            Linking.openURL(linkMaps);
        }
    }

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
                    <Text style={styles.aulaNivel}>{aula.nivel.name}</Text>
                </View>
            </View>

            <View style={styles.aulaDetalhes}>
                <View style={styles.aulaLinha}>
                    <MaterialCommunityIcons name="calendar-outline" size={15} color="#6B7280" />
                    <Text style={styles.aulaTexto}>
                        {dataFormatada.data} às {dataFormatada.hora}
                    </Text>
                </View>

                <View style={styles.aulaLinha}>
                    <MaterialCommunityIcons name="account-outline" size={15} color="#6B7280" />
                    <Text style={styles.aulaTexto}>{aula.usuario.name}</Text>
                </View>

                {aula.usuario.phone && (
                    <View style={styles.aulaLinha}>
                        <MaterialCommunityIcons name="phone-outline" size={15} color="#6B7280" />
                        <Text style={styles.aulaTexto}>{aula.usuario.phone}</Text>
                    </View>
                )}

                {enderecoTexto && (
                    <View style={styles.aulaLinha}>
                        <MaterialCommunityIcons name="map-marker-outline" size={15} color="#6B7280" />
                        <Text style={styles.aulaTexto} numberOfLines={2}>
                            {enderecoTexto}
                        </Text>
                    </View>
                )}
            </View>

            {linkMaps && (
                <TouchableOpacity
                    style={styles.botaoVerEndereco}
                    activeOpacity={0.85}
                    onPress={handleAbrirMapa}
                >
                    <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.botaoVerEnderecoTexto}>Ver endereço no mapa</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}