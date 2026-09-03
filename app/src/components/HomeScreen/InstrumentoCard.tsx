import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './HomeScreen.styles';
import { InstrumentoUsuario } from './types';

interface InstrumentoCardProps {
    instrumento: InstrumentoUsuario;
    onPress: () => void;
}

export function InstrumentoCard({ instrumento, onPress }: InstrumentoCardProps) {
    const icone = getInstrumentIcon(instrumento.instrumento);

    return (
        <TouchableOpacity style={styles.instrumentoCard} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.instrumentoIcone}>
                {icone.familia === 'material' ? (
                    <MaterialCommunityIcons name={icone.nome} size={25} color="#093373" />
                ) : (
                    <FontAwesome5 name={icone.nome} size={23} color="#093373" />
                )}
            </View>

            <View style={styles.instrumentoInfo}>
                <Text style={styles.instrumentoNome}>{instrumento.instrumento}</Text>

                <View style={styles.instrumentoNivel}>
                    <Text style={{ color: '#B8842E', fontSize: 12 }}>★</Text>
                    <Text style={styles.instrumentoNivelTexto}>{instrumento.nivel}</Text>
                </View>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={22} color="#093373" />
        </TouchableOpacity>
    );
}