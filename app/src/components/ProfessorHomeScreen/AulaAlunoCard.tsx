import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { formatarDataBrasilia } from '../HomeScreen/formatters';

import { styles } from './ProfessorHomeScreen.styles';
import { AgendamentoProfessor } from './types';

interface AulaAlunoCardProps {
    aula: AgendamentoProfessor;
    cancelando: boolean;
    onCancelar: () => void;
}

export function AulaAlunoCard({
    aula,
    cancelando,
    onCancelar,
}: AulaAlunoCardProps) {
    const icone = getInstrumentIcon(
        aula.instrumento.name
    );

    const dataFormatada =
        formatarDataBrasilia(aula.dataHora);

    return (
        <View style={styles.aulaCard}>
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

                    <Text style={styles.aulaNivel}>
                        {aula.nivel.name}
                    </Text>
                </View>
            </View>

            <View style={styles.aulaDetalhes}>
                <View style={styles.aulaLinha}>
                    <MaterialCommunityIcons
                        name="calendar-outline"
                        size={15}
                        color="#6B7280"
                    />

                    <Text style={styles.aulaTexto}>
                        {dataFormatada.data} às{' '}
                        {dataFormatada.hora}
                    </Text>
                </View>

                <View style={styles.aulaLinha}>
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={15}
                        color="#6B7280"
                    />

                    <Text style={styles.aulaTexto}>
                        {aula.usuario.name}
                    </Text>
                </View>

                {aula.usuario.phone && (
                    <View style={styles.aulaLinha}>
                        <MaterialCommunityIcons
                            name="phone-outline"
                            size={15}
                            color="#6B7280"
                        />

                        <Text style={styles.aulaTexto}>
                            {aula.usuario.phone}
                        </Text>
                    </View>
                )}
            </View>

            {/* CANCELAR AULA */}
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