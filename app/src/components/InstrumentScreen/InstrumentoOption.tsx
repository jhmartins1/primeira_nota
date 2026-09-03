import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './InstrumentScreen.styles';

interface InstrumentoOptionProps {
    instrumento: string;
    selecionado: boolean;
    onPress: () => void;
}

export function InstrumentoOption({
    instrumento,
    selecionado,
    onPress,
}: InstrumentoOptionProps) {
    const icone = getInstrumentIcon(instrumento);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
        >
            <View
                style={[
                    styles.iconeContainer,
                    selecionado && styles.iconeContainerSelecionado,
                ]}
            >
                {icone.familia === 'material' ? (
                    <MaterialCommunityIcons
                        name={icone.nome}
                        size={32}
                        color={selecionado ? '#FFFFFF' : '#093373'}
                    />
                ) : (
                    <FontAwesome5
                        name={icone.nome}
                        size={30}
                        color={selecionado ? '#FFFFFF' : '#093373'}
                    />
                )}
            </View>

            <Text
                style={[
                    styles.nomeInstrumento,
                    selecionado && styles.nomeInstrumentoSelecionado,
                ]}
            >
                {instrumento}
            </Text>

            {selecionado && (
                <View style={styles.checkContainer}>
                    <MaterialCommunityIcons name="check" size={19} color="#FFFFFF" />
                </View>
            )}
        </TouchableOpacity>
    );
}