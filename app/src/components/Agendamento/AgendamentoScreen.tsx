import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { TeacherConstants } from '../../constants/TeacherConstants';
import { gerarDisponibilidade } from '../../utils/disponibilidade';

import { styles } from './AgendamentoScreen.styles';

const AZUL = '#093373';

export function AgendamentoScreen() {
    const router = useRouter();

    const { instrumento, nivel } = useLocalSearchParams<{
        instrumento: string;
        nivel: string;
    }>();

    const [professorSelecionado, setProfessorSelecionado] =
        useState<number | null>(null);

    const [diaSelecionado, setDiaSelecionado] =
        useState<string | null>(null);

    const [horarioSelecionado, setHorarioSelecionado] =
        useState<string | null>(null);

    /*
     * =========================
     * DADOS
     * =========================
     */

    const professores = useMemo(() => {
        return TeacherConstants.TEACHERS.filter(
            (professor) =>
                professor.instrument.includes(instrumento) &&
                professor.level.includes(nivel)
        );
    }, [instrumento, nivel]);

    const disponibilidade = useMemo(() => {
        if (professorSelecionado === null) {
            return [];
        }

        return gerarDisponibilidade(professorSelecionado);
    }, [professorSelecionado]);

    const diaAtual = disponibilidade.find(
        (dia) => dia.data === diaSelecionado
    );

    const professor = professores.find(
        (prof) => prof.id === professorSelecionado
    );

    /*
     * =========================
     * ÍCONE E NÍVEL
     * =========================
     */

    const iconeInstrumento = getInstrumentIcon(instrumento);

    const estrelasNivel =
        nivel === 'Iniciante'
            ? '★'
            : nivel === 'Intermediário'
                ? '★★'
                : '★★★';

    /*
     * =========================
     * AÇÕES
     * =========================
     */

    function handleSelecionarProfessor(id: number) {
        setProfessorSelecionado(id);

        // Ao trocar de professor,
        // resetamos dia e horário.
        setDiaSelecionado(null);
        setHorarioSelecionado(null);
    }

    function handleSelecionarDia(data: string) {
        setDiaSelecionado(data);

        // Ao trocar o dia,
        // resetamos o horário.
        setHorarioSelecionado(null);
    }

    function handleCancelar() {
        Alert.alert(
            'Cancelar agendamento?',
            'Você vai perder as seleções feitas.',
            [
                {
                    text: 'Continuar agendando',
                    style: 'cancel',
                },
                {
                    text: 'Cancelar',
                    style: 'destructive',
                    onPress: () => router.back(),
                },
            ]
        );
    }

    function formatarDataAgendamento(data: string) {
        const dataObj = new Date(`${data}T12:00:00`);

        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');

        const diasSemana = [
            'Domingo',
            'Segunda-feira',
            'Terça-feira',
            'Quarta-feira',
            'Quinta-feira',
            'Sexta-feira',
            'Sábado',
        ];

        const diaSemana = diasSemana[dataObj.getDay()];

        return `${dia}/${mes} (${diaSemana})`;
    }

    function handleConfirmar() {
        if (!professor || !diaAtual || !horarioSelecionado) {
            return;
        }

        const dataFormatada = formatarDataAgendamento(diaAtual.data);

        Alert.alert(
            'Confirmar agendamento',
            `Você deseja agendar sua aula de ${instrumento} com ${professor.name}?\n\n` +
            `📅 ${dataFormatada}\n` +
            `🕐 ${horarioSelecionado}\n` +
            `⭐ ${nivel}`,
            [
                {
                    text: 'VOLTAR',
                    style: 'cancel',
                },
                {
                    text: 'CONFIRMAR',
                    onPress: () => {
                        // TODO: salvar o agendamento no backend

                        Alert.alert(
                            'Aula agendada! 🎉',
                            `${instrumento} com ${professor.name}\n` +
                            `${dataFormatada} às ${horarioSelecionado}`,
                            [
                                {
                                    text: 'OK',
                                    onPress: () => router.back(),
                                },
                            ]
                        );
                    },
                },
            ]
        );
    }

    /*
     * =========================
     * RENDER
     * =========================
     */

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'bottom']}
        >
            <View style={styles.container}>

                {/* =========================
                    HEADER
                ========================= */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={handleCancelar}
                        activeOpacity={0.7}
                        hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                        }}
                    >
                        <Text style={styles.seta}>
                            ‹
                        </Text>

                        <Text style={styles.textoVoltar}>
                            Voltar
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.eyebrow}>
                        Agendar aula
                    </Text>

                    <View style={styles.instrumentoHeader}>

                        {/* ÍCONE */}
                        <View style={styles.iconeInstrumento}>
                            {iconeInstrumento.familia === 'material' ? (
                                <MaterialCommunityIcons
                                    name={iconeInstrumento.nome}
                                    size={28}
                                    color={AZUL}
                                />
                            ) : (
                                <FontAwesome5
                                    name={iconeInstrumento.nome}
                                    size={25}
                                    color={AZUL}
                                />
                            )}
                        </View>

                        {/* NOME DO INSTRUMENTO */}
                        <Text
                            style={styles.titulo}
                            numberOfLines={1}
                        >
                            {instrumento}
                        </Text>

                        {/* NÍVEL */}
                        <View style={styles.nivelBadge}>

                            <Text style={styles.estrelasNivel}>
                                {estrelasNivel}
                            </Text>

                            <Text
                                style={styles.nivelTexto}
                                numberOfLines={1}
                            >
                                {nivel}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* =========================
                    CONTEÚDO
                ========================= */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >

                    {/* =========================
                        PROFESSORES
                    ========================= */}

                    <Text style={styles.secaoTitulo}>
                        Escolha o professor
                    </Text>

                    <Text style={styles.secaoDescricao}>
                        Selecione o professor com quem deseja fazer sua aula.
                    </Text>

                    {professores.length === 0 ? (
                        <Text style={styles.vazioTexto}>
                            Nenhum professor disponível para esse nível no momento.
                        </Text>
                    ) : (
                        <View style={styles.professoresContainer}>

                            {professores.map((prof) => {

                                const selecionado =
                                    professorSelecionado === prof.id;

                                return (
                                    <TouchableOpacity
                                        key={prof.id}
                                        style={[
                                            styles.professorCard,
                                            selecionado &&
                                            styles.professorCardSelecionado,
                                        ]}
                                        onPress={() =>
                                            handleSelecionarProfessor(prof.id)
                                        }
                                        activeOpacity={0.8}
                                    >

                                        {/* FOTO + CHECK */}
                                        <View style={styles.professorFotoContainer}>

                                            <Image
                                                source={{
                                                    uri: prof.photo,
                                                }}
                                                style={styles.professorFoto}
                                            />

                                            {selecionado && (
                                                <View style={styles.professorCheck}>
                                                    <Text
                                                        style={
                                                            styles.professorCheckTexto
                                                        }
                                                    >
                                                        ✓
                                                    </Text>
                                                </View>
                                            )}

                                        </View>

                                        <Text
                                            style={[
                                                styles.professorNome,
                                                selecionado &&
                                                styles.professorNomeSelecionado,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {prof.name}
                                        </Text>

                                    </TouchableOpacity>
                                );
                            })}

                        </View>
                    )}

                    {/* =========================
                        DIA
                    ========================= */}

                    {professorSelecionado !== null && (
                        <>
                            <Text style={styles.secaoTitulo}>
                                Escolha o dia
                            </Text>

                            <Text style={styles.secaoDescricao}>
                                Veja os dias disponíveis para este professor.
                            </Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.diasContainer}
                            >
                                {disponibilidade.map((dia) => {

                                    const selecionado =
                                        diaSelecionado === dia.data;

                                    const temHorarios =
                                        dia.horarios.length > 0;

                                    return (
                                        <TouchableOpacity
                                            key={dia.data}
                                            disabled={!temHorarios}
                                            style={[
                                                styles.diaCard,
                                                selecionado &&
                                                styles.diaCardSelecionado,
                                                !temHorarios &&
                                                styles.diaCardDesabilitado,
                                            ]}
                                            onPress={() =>
                                                handleSelecionarDia(dia.data)
                                            }
                                            activeOpacity={0.8}
                                        >

                                            <Text
                                                style={[
                                                    styles.diaSemanaTexto,
                                                    selecionado &&
                                                    styles.diaTextoSelecionado,
                                                ]}
                                            >
                                                {dia.diaSemana}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.diaMesTexto,
                                                    selecionado &&
                                                    styles.diaTextoSelecionado,
                                                ]}
                                            >
                                                {dia.diaMes}
                                            </Text>

                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </>
                    )}

                    {/* =========================
                        HORÁRIOS
                    ========================= */}

                    {diaAtual && (
                        <>
                            <Text style={styles.secaoTitulo}>
                                Escolha o horário
                            </Text>

                            <Text style={styles.secaoDescricao}>
                                Selecione um dos horários disponíveis.
                            </Text>

                            {diaAtual.horarios.length === 0 ? (
                                <Text style={styles.vazioTexto}>
                                    Nenhum horário disponível nesse dia.
                                </Text>
                            ) : (
                                <View style={styles.horariosContainer}>

                                    {diaAtual.horarios.map((horario) => {

                                        const selecionado =
                                            horarioSelecionado === horario;

                                        return (
                                            <TouchableOpacity
                                                key={horario}
                                                style={[
                                                    styles.horarioCard,
                                                    selecionado &&
                                                    styles.horarioCardSelecionado,
                                                ]}
                                                onPress={() =>
                                                    setHorarioSelecionado(
                                                        horario
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >

                                                <Text
                                                    style={[
                                                        styles.horarioTexto,
                                                        selecionado &&
                                                        styles.horarioTextoSelecionado,
                                                    ]}
                                                >
                                                    {horario}
                                                </Text>

                                            </TouchableOpacity>
                                        );
                                    })}

                                </View>
                            )}
                        </>
                    )}

                    {/* =========================
                        RESUMO
                    ========================= */}

                    {horarioSelecionado &&
                        professor &&
                        diaAtual && (
                            <>

                                <Text style={styles.secaoTitulo}>
                                    Resumo da aula
                                </Text>

                                <View style={styles.resumoCard}>

                                    <Image
                                        source={{
                                            uri: professor.photo,
                                        }}
                                        style={styles.resumoFoto}
                                    />

                                    <View style={styles.resumoTextos}>

                                        <Text
                                            style={styles.resumoInstrumento}
                                        >
                                            {instrumento} · {nivel}
                                        </Text>

                                        <Text
                                            style={styles.resumoProfessor}
                                        >
                                            com {professor.name}
                                        </Text>

                                        <Text
                                            style={styles.resumoData}
                                        >
                                            {diaAtual.diaSemana}, dia{' '}
                                            {diaAtual.diaMes} às{' '}
                                            {horarioSelecionado}
                                        </Text>

                                    </View>

                                </View>

                            </>
                        )}

                    {/* Espaço para o footer não ficar
                        grudado no conteúdo */}
                    {horarioSelecionado && (
                        <View style={styles.espacoFooter} />
                    )}

                </ScrollView>

                {/* =========================
                    BOTÃO INFERIOR
                ========================= */}

                {horarioSelecionado && (
                    <View style={styles.footer}>

                        <TouchableOpacity
                            style={styles.botaoConfirmar}
                            onPress={handleConfirmar}
                            activeOpacity={0.85}
                        >
                            <Text
                                style={styles.botaoConfirmarTexto}
                            >
                                Confirmar agendamento
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}