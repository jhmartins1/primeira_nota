import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TeacherConstants } from '../../constants/TeacherConstants';
import { gerarDisponibilidade } from '../../utils/disponibilidade';
import { styles } from './AgendamentoScreen.styles';

export function AgendamentoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { instrumento, nivel } = useLocalSearchParams<{
        instrumento: string;
        nivel: string;
    }>();

    const [professorSelecionado, setProfessorSelecionado] = useState<number | null>(null);
    const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

    const professores = useMemo(() => {
        return TeacherConstants.TEACHERS.filter(
            (professor) =>
                professor.instrument.includes(instrumento) &&
                professor.level.includes(nivel)
        );
    }, [instrumento, nivel]);

    const disponibilidade = useMemo(() => {
        if (!professorSelecionado) return [];
        return gerarDisponibilidade(professorSelecionado);
    }, [professorSelecionado]);

    const diaAtual = disponibilidade.find((dia) => dia.data === diaSelecionado);
    const professor = professores.find((p) => p.id === professorSelecionado);

    function handleSelecionarProfessor(id: number) {
        setProfessorSelecionado(id);
        setDiaSelecionado(null);
        setHorarioSelecionado(null);
    }

    function handleSelecionarDia(data: string) {
        setDiaSelecionado(data);
        setHorarioSelecionado(null);
    }

    function handleCancelar() {
        Alert.alert('Cancelar agendamento?', 'Você vai perder as seleções feitas.', [
            { text: 'Continuar agendando', style: 'cancel' },
            { text: 'Cancelar', style: 'destructive', onPress: () => router.back() },
        ]);
    }

    function handleConfirmar() {
        Alert.alert(
            'Aula agendada!',
            `${instrumento} com ${professor?.name}\n${diaAtual?.diaSemana} ${diaAtual?.diaMes} às ${horarioSelecionado}`,
            [{ text: 'OK', onPress: () => router.back() }]
        );
        // TODO: quando existir backend, salvar o agendamento aqui
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.botaoVoltarTexto}>‹ Voltar</Text>
                </TouchableOpacity>

                <View style={styles.headerTextos}>
                    <Text style={styles.eyebrow}>Agendar aula</Text>
                    <Text style={styles.titulo}>{instrumento}</Text>
                    <Text style={styles.subtitulo}>Nível {nivel}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.secaoTitulo}>Escolha o professor</Text>

                {professores.length === 0 ? (
                    <Text style={styles.vazioTexto}>
                        Nenhum professor disponível para esse nível no momento.
                    </Text>
                ) : (
                    <View style={styles.professoresContainer}>
                        {professores.map((prof) => {
                            const selecionado = professorSelecionado === prof.id;
                            return (
                                <TouchableOpacity
                                    key={prof.id}
                                    style={[styles.professorCard, selecionado && styles.professorCardSelecionado]}
                                    onPress={() => handleSelecionarProfessor(prof.id)}
                                >
                                    <Image source={{ uri: prof.photo }} style={styles.professorFoto} />
                                    <Text style={styles.professorNome}>{prof.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {professorSelecionado && (
                    <>
                        <Text style={styles.secaoTitulo}>Escolha o dia</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.diasContainer}
                        >
                            {disponibilidade.map((dia) => {
                                const selecionado = diaSelecionado === dia.data;
                                const temHorarios = dia.horarios.length > 0;
                                return (
                                    <TouchableOpacity
                                        key={dia.data}
                                        disabled={!temHorarios}
                                        style={[
                                            styles.diaCard,
                                            selecionado && styles.diaCardSelecionado,
                                            !temHorarios && styles.diaCardDesabilitado,
                                        ]}
                                        onPress={() => handleSelecionarDia(dia.data)}
                                    >
                                        <Text style={[styles.diaSemanaTexto, selecionado && styles.diaTextoSelecionado]}>
                                            {dia.diaSemana}
                                        </Text>
                                        <Text style={[styles.diaMesTexto, selecionado && styles.diaTextoSelecionado]}>
                                            {dia.diaMes}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </>
                )}

                {diaAtual && (
                    <>
                        <Text style={styles.secaoTitulo}>Escolha o horário</Text>
                        {diaAtual.horarios.length === 0 ? (
                            <Text style={styles.vazioTexto}>Nenhum horário disponível nesse dia.</Text>
                        ) : (
                            <View style={styles.horariosContainer}>
                                {diaAtual.horarios.map((horario) => {
                                    const selecionado = horarioSelecionado === horario;
                                    return (
                                        <TouchableOpacity
                                            key={horario}
                                            style={[styles.horarioCard, selecionado && styles.horarioCardSelecionado]}
                                            onPress={() => setHorarioSelecionado(horario)}
                                        >
                                            <Text style={[styles.horarioTexto, selecionado && styles.horarioTextoSelecionado]}>
                                                {horario}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </>
                )}

                {horarioSelecionado && professor && diaAtual && (
                    <>
                        <Text style={styles.secaoTitulo}>Resumo</Text>
                        <View style={styles.resumoCard}>
                            <Image source={{ uri: professor.photo }} style={styles.resumoFoto} />
                            <View style={styles.resumoTextos}>
                                <Text style={styles.resumoInstrumento}>
                                    {instrumento} · {nivel}
                                </Text>
                                <Text style={styles.resumoProfessor}>com {professor.name}</Text>
                                <Text style={styles.resumoData}>
                                    {diaAtual.diaSemana}, dia {diaAtual.diaMes} às {horarioSelecionado}
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {horarioSelecionado && (
                <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
                    <Text style={styles.botaoConfirmarTexto}>Confirmar agendamento</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}