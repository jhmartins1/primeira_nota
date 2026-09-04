import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { getCorNivel } from '../../constants/NivelColors';
import { styles } from './HomeScreen.styles';
import { InstrumentoUsuario } from './types';

interface InstrumentoCardProps {
    instrumento: InstrumentoUsuario;
    onPress: () => void;
}

function obterEstrelas(nivel: string): string {
    switch (nivel.toLowerCase()) {
        case 'iniciante':
            return '★';

        case 'intermediário':
        case 'intermediario':
            return '★★';

        case 'avançado':
        case 'avancado':
            return '★★★';

        default:
            return '★';
    }
}

export function InstrumentoCard({ instrumento, onPress }: InstrumentoCardProps) {
    const icone = getInstrumentIcon(instrumento.instrumento);
    const corNivel = getCorNivel(instrumento.nivel);
    const estrelas = obterEstrelas(instrumento.nivel);

    return (
        <TouchableOpacity
            style={styles.instrumentoCard}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.instrumentoIcone}>
                {icone.familia === 'material' ? (
                    <MaterialCommunityIcons
                        name={icone.nome}
                        size={25}
                        color="#093373"
                    />
                ) : (
                    <FontAwesome5
                        name={icone.nome}
                        size={23}
                        color="#093373"
                    />
                )}
            </View>

            <View style={styles.instrumentoInfo}>
                <Text style={styles.instrumentoNome}>
                    {instrumento.instrumento}
                </Text>

                <View
                    style={[
                        styles.instrumentoNivel,
                        { backgroundColor: corNivel.fundo },
                    ]}
                >
                    <Text
                        style={{
                            color: corNivel.cor,
                            fontSize: 12,
                            fontWeight: '700',
                        }}
                    >
                        {estrelas}
                    </Text>

                    <Text
                        style={[
                            styles.instrumentoNivelTexto,
                            { color: corNivel.cor },
                        ]}
                    >
                        {instrumento.nivel}
                    </Text>
                </View>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#093373"
            />
        </TouchableOpacity>
    );
}
