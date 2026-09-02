import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { styles } from './HomeScreen.styles';

type Selecao = Record<string, string>;

type Aula = {
    id: string;
    instrumento: string;
    nivel: string;
    data: string;
    diaSemana: string;
    horario: string;
    professor: string;
};

/*
==================================================
DADOS MOCKADOS
==================================================

Por enquanto estamos simulando as aulas.

Depois que o backend estiver pronto, isso será
substituído por uma chamada à API:

GET /aulas/minhas

*/

const AULAS_MOCK: Aula[] = [
    {
        id: '1',
        instrumento: 'Guitarra',
        nivel: 'Iniciante',
        data: '02/09',
        diaSemana: 'Quarta-feira',
        horario: '19:00',
        professor: 'João Silva',
    },
    {
        id: '2',
        instrumento: 'Violão',
        nivel: 'Iniciante',
        data: '05/09',
        diaSemana: 'Sábado',
        horario: '15:00',
        professor: 'Carlos Mendes',
    },
    {
        id: '3',
        instrumento: 'Teclado',
        nivel: 'Iniciante',
        data: '09/09',
        diaSemana: 'Quarta-feira',
        horario: '18:00',
        professor: 'Mariana Souza',
    },
];

/*
==================================================
COMPONENTE DE ÍCONE DO INSTRUMENTO
==================================================

O getInstrumentIcon() retorna:

{
    familia: 'material',
    nome: 'guitar-acoustic'
}

ou:

{
    familia: 'fontawesome5',
    nome: 'drum'
}

Precisamos transformar isso no componente
correto antes de renderizar.
*/

function IconeInstrumento({
    instrumento,
    tamanho,
}: {
    instrumento: string;
    tamanho: number;
}) {
    const icone = getInstrumentIcon(instrumento);

    if (icone.familia === 'material') {
        return (
            <MaterialCommunityIcons
                name={icone.nome}
                size={tamanho}
                color="#093373"
            />
        );
    }

    if (icone.familia === 'fontawesome5') {
        return (
            <FontAwesome5
                name={icone.nome}
                size={tamanho}
                color="#093373"
            />
        );
    }

    return null;
}

export default function HomeScreen() {
    const router = useRouter();

    const params = useLocalSearchParams();

    /*
    ==================================================
    RECUPERA OS INSTRUMENTOS DO ONBOARDING
    ==================================================

    O LevelScreen atualmente envia:

    router.replace({
        pathname: '/home',
        params: {
            selecao: JSON.stringify(selecaoFinal),
        },
    });

    Exemplo:

    {
        "Guitarra": "Iniciante",
        "Violão": "Iniciante"
    }
    */

    const selecaoParam = Array.isArray(params.selecao)
        ? params.selecao[0]
        : params.selecao;

    const selecao: Selecao = useMemo(() => {
        if (!selecaoParam) {
            return {};
        }

        try {
            return JSON.parse(selecaoParam);
        } catch {
            console.warn(
                'Não foi possível interpretar os instrumentos recebidos.',
            );

            return {};
        }
    }, [selecaoParam]);

    /*
    ==================================================
    INSTRUMENTOS
    ==================================================
    */

    const instrumentos = Object.entries(selecao);

    /*
    ==================================================
    AULAS
    ==================================================
    */

    const aulas = AULAS_MOCK;

    /*
    ==================================================
    PRÓXIMA AULA
    ==================================================
    */

    const proximaAula = aulas.length > 0
        ? aulas[0]
        : null;

    /*
    ==================================================
    OUTRAS AULAS
    ==================================================

    A primeira aula já aparece no card
    "Próxima aula", então aqui mostramos as demais.
    */

    const proximasAulas = aulas.slice(1);

    /*
    ==================================================
    NAVEGAÇÃO
    ==================================================
    */

    function handleAgendar() {
        router.push('/agendamento');
    }

    function handleEditarInstrumentos() {
        router.push('/instrument');
    }

    function handleVerDetalhes(aula: Aula) {
        console.log('Detalhes da aula:', aula);
    }

    function handleVerTodas() {
        console.log('Ver todas as aulas');
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={['top']}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <View style={styles.header}>
                    <Text style={styles.eyebrow}>
                        Primeira Nota
                    </Text>

                    <Text style={styles.titulo}>
                        Olá! 👋
                    </Text>

                    <Text style={styles.subtitulo}>
                        Confira suas próximas aulas.
                    </Text>
                </View>


                {/* ==================================================
                    PRÓXIMA AULA
                ================================================== */}

                {proximaAula ? (
                    <View style={styles.proximaAulaCard}>

                        {/* TOPO */}

                        <View style={styles.proximaAulaTopo}>

                            <Text style={styles.proximaAulaLabel}>
                                PRÓXIMA AULA
                            </Text>

                            <View style={styles.proximaAulaStatus}>

                                <View style={styles.statusPonto} />

                                <Text style={styles.statusTexto}>
                                    Agendada
                                </Text>

                            </View>

                        </View>


                        {/* INSTRUMENTO */}

                        <View style={styles.proximaAulaConteudo}>

                            <View style={styles.proximaAulaIcone}>

                                <IconeInstrumento
                                    instrumento={
                                        proximaAula.instrumento
                                    }
                                    tamanho={30}
                                />

                            </View>

                            <View style={styles.proximaAulaInfo}>

                                <Text
                                    style={
                                        styles.proximaAulaInstrumento
                                    }
                                >
                                    {proximaAula.instrumento}
                                </Text>

                                <View style={styles.proximaAulaNivel}>

                                    <MaterialCommunityIcons
                                        name="star"
                                        size={14}
                                        color="#B8842E"
                                    />

                                    <Text
                                        style={
                                            styles.proximaAulaNivelTexto
                                        }
                                    >
                                        {proximaAula.nivel}
                                    </Text>

                                </View>

                            </View>

                        </View>


                        {/* DATA E HORÁRIO */}

                        <View style={styles.proximaAulaDetalhes}>

                            <View style={styles.detalheItem}>

                                <MaterialCommunityIcons
                                    name="calendar-outline"
                                    size={19}
                                    color="#093373"
                                />

                                <View>

                                    <Text style={styles.detalheLabel}>
                                        Data
                                    </Text>

                                    <Text style={styles.detalheValor}>
                                        {proximaAula.diaSemana}
                                    </Text>

                                    <Text style={styles.detalheSubvalor}>
                                        {proximaAula.data}
                                    </Text>

                                </View>

                            </View>


                            <View style={styles.detalheItem}>

                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={19}
                                    color="#093373"
                                />

                                <View>

                                    <Text style={styles.detalheLabel}>
                                        Horário
                                    </Text>

                                    <Text style={styles.detalheValor}>
                                        {proximaAula.horario}
                                    </Text>

                                </View>

                            </View>

                        </View>


                        {/* PROFESSOR */}

                        <View style={styles.professorContainer}>

                            <View style={styles.professorIcone}>

                                <MaterialCommunityIcons
                                    name="account-outline"
                                    size={20}
                                    color="#093373"
                                />

                            </View>

                            <View style={styles.professorInfo}>

                                <Text style={styles.detalheLabel}>
                                    Professor
                                </Text>

                                <Text style={styles.professorNome}>
                                    {proximaAula.professor}
                                </Text>

                            </View>

                        </View>


                        {/* DETALHES */}

                        <TouchableOpacity
                            style={styles.botaoDetalhes}
                            onPress={() =>
                                handleVerDetalhes(proximaAula)
                            }
                            activeOpacity={0.8}
                        >

                            <Text
                                style={
                                    styles.botaoDetalhesTexto
                                }
                            >
                                Ver detalhes
                            </Text>

                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={18}
                                color="#FFFFFF"
                            />

                        </TouchableOpacity>

                    </View>
                ) : (

                    /* ==================================================
                       NENHUMA AULA
                    ================================================== */

                    <View style={styles.semAulaCard}>

                        <View style={styles.semAulaIcone}>

                            <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                size={32}
                                color="#093373"
                            />

                        </View>

                        <Text style={styles.semAulaTitulo}>
                            Nenhuma aula agendada
                        </Text>

                        <Text style={styles.semAulaTexto}>
                            Você ainda não possui nenhuma aula marcada.
                            Que tal agendar sua primeira aula?
                        </Text>

                    </View>
                )}


                {/* ==================================================
                    MINHAS AULAS
                ================================================== */}

                <View style={styles.secao}>

                    <View style={styles.secaoHeader}>

                        <View>

                            <Text style={styles.secaoTitulo}>
                                Minhas aulas
                            </Text>

                            <Text style={styles.secaoSubtitulo}>
                                Próximos agendamentos
                            </Text>

                        </View>


                        {aulas.length > 0 && (
                            <TouchableOpacity
                                onPress={handleVerTodas}
                                activeOpacity={0.7}
                            >

                                <Text style={styles.verTodas}>
                                    Ver todas
                                </Text>

                            </TouchableOpacity>
                        )}

                    </View>


                    {proximasAulas.length > 0 ? (

                        <View style={styles.listaAulas}>

                            {proximasAulas.map((aula) => (

                                <TouchableOpacity
                                    key={aula.id}
                                    style={styles.aulaCard}
                                    onPress={() =>
                                        handleVerDetalhes(aula)
                                    }
                                    activeOpacity={0.8}
                                >

                                    {/* ÍCONE */}

                                    <View style={styles.aulaIcone}>

                                        <IconeInstrumento
                                            instrumento={
                                                aula.instrumento
                                            }
                                            tamanho={24}
                                        />

                                    </View>


                                    {/* INFORMAÇÕES */}

                                    <View style={styles.aulaInfo}>

                                        <Text
                                            style={
                                                styles.aulaInstrumento
                                            }
                                        >
                                            {aula.instrumento}
                                        </Text>


                                        <View
                                            style={
                                                styles.aulaDataLinha
                                            }
                                        >

                                            <MaterialCommunityIcons
                                                name="calendar-outline"
                                                size={14}
                                                color="#6B7280"
                                            />

                                            <Text
                                                style={
                                                    styles.aulaData
                                                }
                                            >
                                                {aula.data} •{' '}
                                                {aula.horario}
                                            </Text>

                                        </View>


                                        <View
                                            style={
                                                styles.aulaProfessorLinha
                                            }
                                        >

                                            <MaterialCommunityIcons
                                                name="account-outline"
                                                size={14}
                                                color="#6B7280"
                                            />

                                            <Text
                                                style={
                                                    styles.aulaProfessor
                                                }
                                            >
                                                {aula.professor}
                                            </Text>

                                        </View>

                                    </View>


                                    {/* SETA */}

                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={24}
                                        color="#9CA3AF"
                                    />

                                </TouchableOpacity>

                            ))}

                        </View>

                    ) : (

                        <View style={styles.listaVazia}>

                            <Text style={styles.listaVaziaTexto}>
                                Nenhuma outra aula agendada.
                            </Text>

                        </View>

                    )}

                </View>


                {/* ==================================================
                    AGENDAR NOVA AULA
                ================================================== */}

                <TouchableOpacity
                    style={styles.botaoAgendar}
                    onPress={handleAgendar}
                    activeOpacity={0.85}
                >

                    <View style={styles.botaoAgendarIcone}>

                        <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color="#093373"
                        />

                    </View>


                    <View style={styles.botaoAgendarInfo}>

                        <Text style={styles.botaoAgendarTitulo}>
                            Agendar nova aula
                        </Text>

                        <Text
                            style={
                                styles.botaoAgendarSubtitulo
                            }
                        >
                            Escolha instrumento, professor e horário
                        </Text>

                    </View>


                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={22}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>


                {/* ==================================================
                    MEUS INSTRUMENTOS
                ================================================== */}

                <View style={styles.secao}>

                    <View style={styles.secaoHeader}>

                        <View>

                            <Text style={styles.secaoTitulo}>
                                Meus instrumentos
                            </Text>

                            <Text style={styles.secaoSubtitulo}>
                                Seus níveis atuais
                            </Text>

                        </View>


                        <TouchableOpacity
                            style={
                                styles.botaoEditarInstrumentos
                            }
                            onPress={handleEditarInstrumentos}
                            activeOpacity={0.8}
                        >

                            <MaterialCommunityIcons
                                name="pencil-outline"
                                size={16}
                                color="#093373"
                            />

                            <Text
                                style={
                                    styles.botaoEditarInstrumentosTexto
                                }
                            >
                                Editar
                            </Text>

                        </TouchableOpacity>

                    </View>


                    {instrumentos.length > 0 ? (

                        <View style={styles.instrumentosLista}>

                            {instrumentos.map(
                                ([instrumento, nivel]) => (

                                    <View
                                        key={instrumento}
                                        style={
                                            styles.instrumentoCard
                                        }
                                    >

                                        {/* ÍCONE */}

                                        <View
                                            style={
                                                styles.instrumentoIcone
                                            }
                                        >

                                            <IconeInstrumento
                                                instrumento={
                                                    instrumento
                                                }
                                                tamanho={23}
                                            />

                                        </View>


                                        {/* INFORMAÇÕES */}

                                        <View
                                            style={
                                                styles.instrumentoInfo
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.instrumentoNome
                                                }
                                            >
                                                {instrumento}
                                            </Text>

                                            <View
                                                style={
                                                    styles.instrumentoNivel
                                                }
                                            >

                                                <MaterialCommunityIcons
                                                    name="star"
                                                    size={13}
                                                    color="#B8842E"
                                                />

                                                <Text
                                                    style={
                                                        styles.instrumentoNivelTexto
                                                    }
                                                >
                                                    {nivel}
                                                </Text>

                                            </View>

                                        </View>


                                        {/* CHECK */}

                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={21}
                                            color="#093373"
                                        />

                                    </View>

                                ),
                            )}

                        </View>

                    ) : (

                        <View
                            style={
                                styles.instrumentosVazio
                            }
                        >

                            <Text
                                style={
                                    styles.instrumentosVazioTexto
                                }
                            >
                                Nenhum instrumento cadastrado.
                            </Text>

                            <TouchableOpacity
                                onPress={
                                    handleEditarInstrumentos
                                }
                                activeOpacity={0.7}
                            >

                                <Text
                                    style={
                                        styles.instrumentosVazioLink
                                    }
                                >
                                    Adicionar instrumento
                                </Text>

                            </TouchableOpacity>

                        </View>

                    )}

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}