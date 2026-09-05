import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './InstrumentScreen.styles';

interface InstrumentoOptionProps {
    instrumento: string;
    selecionado: boolean;
    onPress: () => void;

    mostrarPossuiInstrumento?: boolean;
    possuiInstrumento?: boolean;
    onTogglePossuiInstrumento?: () => void;
}

export function InstrumentoOption({
    instrumento,
    selecionado,
    onPress,

    mostrarPossuiInstrumento = false,
    possuiInstrumento = false,
    onTogglePossuiInstrumento,
}: InstrumentoOptionProps) {
    const icone =
        getInstrumentIcon(instrumento);

    function handleTogglePossuiInstrumento() {
        onTogglePossuiInstrumento?.();
    }

    return (
        <View
            style={[
                styles.opcaoWrapper,

                selecionado &&
                styles.opcaoWrapperSelecionado,
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={[
                    styles.opcao,

                    selecionado &&
                    styles.opcaoSelecionada,
                ]}
            >
                <View
                    style={[
                        styles.iconeContainer,

                        selecionado &&
                        styles.iconeContainerSelecionado,
                    ]}
                >
                    {icone.familia ===
                        'material' ? (
                        <MaterialCommunityIcons
                            name={
                                icone.nome
                            }
                            size={32}
                            color={
                                selecionado
                                    ? '#FFFFFF'
                                    : '#093373'
                            }
                        />
                    ) : (
                        <FontAwesome5
                            name={
                                icone.nome
                            }
                            size={30}
                            color={
                                selecionado
                                    ? '#FFFFFF'
                                    : '#093373'
                            }
                        />
                    )}
                </View>

                <Text
                    style={[
                        styles.nomeInstrumento,

                        selecionado &&
                        styles.nomeInstrumentoSelecionado,
                    ]}
                >
                    {instrumento}
                </Text>

                {selecionado && (
                    <View
                        style={
                            styles.checkContainer
                        }
                    >
                        <MaterialCommunityIcons
                            name="check"
                            size={19}
                            color="#FFFFFF"
                        />
                    </View>
                )}
            </TouchableOpacity>

            {selecionado &&
                mostrarPossuiInstrumento && (
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={
                            handleTogglePossuiInstrumento
                        }
                        style={
                            styles.possuiInstrumentoContainer
                        }
                    >
                        <View
                            style={[
                                styles.checkboxPossui,

                                possuiInstrumento &&
                                styles.checkboxPossuiSelecionado,
                            ]}
                        >
                            {possuiInstrumento && (
                                <MaterialCommunityIcons
                                    name="check"
                                    size={16}
                                    color="#FFFFFF"
                                />
                            )}
                        </View>

                        <View
                            style={
                                styles.possuiInstrumentoTextos
                            }
                        >
                            <Text
                                style={
                                    styles.possuiInstrumentoTitulo
                                }
                            >
                                Você possui este instrumento?
                            </Text>

                            <Text
                                style={
                                    styles.possuiInstrumentoDescricao
                                }
                            >
                                {possuiInstrumento
                                    ? 'Sim, tenho este instrumento em casa.'
                                    : 'Não possuo este instrumento.'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
        </View>
    );
}