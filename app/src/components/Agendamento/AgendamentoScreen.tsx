import { useAuth } from '@clerk/expo';
import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getInstrumentIcon } from '../../constants/InstrumentIcons';
import { getCorNivel } from '../../constants/NivelColors';
import { styles } from './AgendamentoScreen.styles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type InstrumentoUsuario = {
    instrumentoId: number;
    instrumento: string;
    nivelId: number;
    nivel: string;
};

type ProfessorAPI = {
    id: number;
    name: string;
    image?: string | null;
};

type DisponibilidadeAPI = {
    data: string;
    professor: ProfessorAPI;
    instrumento: {
        id: number;
        name: string;
    };
    nivel: {
        id: number;
        name: string;
    };
    horarios: string[];
};

type DiaDisponivel = {
    data: string;
    diaSemana: string;
    diaMes: string;
};

type IconeInstrumento =
    | {
        familia: 'material';
        nome: keyof typeof MaterialCommunityIcons.glyphMap;
    }
    | {
        familia: 'fontawesome5';
        nome: keyof typeof FontAwesome5.glyphMap;
    };

function criarDiasDisponiveis(
    disponibilidade: DisponibilidadeAPI[]
): DiaDisponivel[] {
    const datasUnicas = Array.from(
        new Set(disponibilidade.map((item) => item.data))
    );

    return datasUnicas.map((data) => {
        const [ano, mes, dia] = data.split('-').map(Number);
        const dataLocal = new Date(ano, mes - 1, dia);

        const diaSemana = dataLocal
            .toLocaleDateString('pt-BR', {
                weekday: 'short',
            })
            .replace('.', '');

        return {
            data,
            diaSemana:
                diaSemana.charAt(0).toUpperCase() +
                diaSemana.slice(1),
            diaMes: String(dia).padStart(2, '0'),
        };
    });
}

function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function obterEstrelasNivel(nivel: string): string {
    const nivelNormalizado = nivel
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    switch (nivelNormalizado) {
        case 'iniciante':
            return '★';

        case 'intermediario':
            return '★★';

        case 'avancado':
            return '★★★';

        default:
            return '★';
    }
}

export default function AgendamentoScreen() {
    const router = useRouter();
    const { getToken } = useAuth();

    const [instrumentos, setInstrumentos] = useState<
        InstrumentoUsuario[]
    >([]);

    const [instrumentoSelecionado, setInstrumentoSelecionado] =
        useState<InstrumentoUsuario | null>(null);

    const [disponibilidade, setDisponibilidade] = useState<
        DisponibilidadeAPI[]
    >([]);

    const [professorSelecionado, setProfessorSelecionado] =
        useState<ProfessorAPI | null>(null);

    const [diaSelecionado, setDiaSelecionado] =
        useState<DiaDisponivel | null>(null);

    const [horarioSelecionado, setHorarioSelecionado] =
        useState<string | null>(null);

    const [carregandoInstrumentos, setCarregandoInstrumentos] =
        useState(true);

    const [carregandoDisponibilidade, setCarregandoDisponibilidade] =
        useState(false);

    const [erro, setErro] = useState<string | null>(null);

    const [confirmando, setConfirmando] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carregarInstrumentos() {
            try {
                if (!API_URL) {
                    throw new Error(
                        'EXPO_PUBLIC_API_URL não configurada.'
                    );
                }

                setCarregandoInstrumentos(true);
                setErro(null);

                const token = await getToken();

                if (!token) {
                    throw new Error(
                        'Token de autenticação não encontrado.'
                    );
                }

                const response = await fetch(
                    `${API_URL}/usuario/me`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const texto = await response.text();

                if (!response.ok) {
                    throw new Error(
                        `Erro ao buscar usuário: ${response.status}`
                    );
                }

                const usuario = JSON.parse(texto);

                const instrumentosUsuario: InstrumentoUsuario[] =
                    (usuario.instrumentos ?? []).map(
                        (item: any) => ({
                            instrumentoId:
                                item.instrumentoId ??
                                item.instrumento?.id,

                            instrumento:
                                typeof item.instrumento === 'string'
                                    ? item.instrumento
                                    : item.instrumento?.name,

                            nivelId:
                                item.nivelId ??
                                item.nivel?.id,

                            nivel:
                                typeof item.nivel === 'string'
                                    ? item.nivel
                                    : item.nivel?.name,
                        })
                    );

                const instrumentosResponse = await fetch(
                    `${API_URL}/instrument`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const instrumentosTexto =
                    await instrumentosResponse.text();

                if (!instrumentosResponse.ok) {
                    throw new Error(
                        `Erro ao buscar instrumentos: ${instrumentosResponse.status}`
                    );
                }

                const instrumentosAPI =
                    JSON.parse(instrumentosTexto);

                const niveisResponse = await fetch(
                    `${API_URL}/nivel`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const niveisTexto = await niveisResponse.text();

                if (!niveisResponse.ok) {
                    throw new Error(
                        `Erro ao buscar níveis: ${niveisResponse.status}`
                    );
                }

                const niveisAPI = JSON.parse(niveisTexto);

                const instrumentosComIds =
                    instrumentosUsuario.map((item) => {
                        const instrumentoAPI =
                            instrumentosAPI.find(
                                (instrumento: any) =>
                                    instrumento.name ===
                                    item.instrumento
                            );

                        const nivelAPI = niveisAPI.find(
                            (nivel: any) =>
                                nivel.name === item.nivel
                        );

                        return {
                            instrumentoId:
                                item.instrumentoId ??
                                instrumentoAPI?.id,

                            instrumento:
                                item.instrumento,

                            nivelId:
                                item.nivelId ??
                                nivelAPI?.id,

                            nivel:
                                item.nivel,
                        };
                    });

                const validos = instrumentosComIds.filter(
                    (item) =>
                        item.instrumentoId &&
                        item.nivelId &&
                        item.instrumento &&
                        item.nivel
                );

                if (!ativo) return;

                setInstrumentos(validos);
            } catch (error) {
                console.error(
                    'AGENDAMENTO: erro ao carregar instrumentos:',
                    error
                );

                if (!ativo) return;

                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar seus instrumentos.'
                );
            } finally {
                if (ativo) {
                    setCarregandoInstrumentos(false);
                }
            }
        }

        carregarInstrumentos();

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        let ativo = true;

        async function carregarDisponibilidade() {
            if (!instrumentoSelecionado) return;

            try {
                if (!API_URL) {
                    throw new Error(
                        'EXPO_PUBLIC_API_URL não configurada.'
                    );
                }

                setCarregandoDisponibilidade(true);
                setErro(null);
                setProfessorSelecionado(null);
                setDiaSelecionado(null);
                setHorarioSelecionado(null);
                setDisponibilidade([]);

                const token = await getToken();

                if (!token) {
                    throw new Error(
                        'Token de autenticação não encontrado.'
                    );
                }

                const url =
                    `${API_URL}/agendamento/disponibilidade` +
                    `?instrumentoId=${instrumentoSelecionado.instrumentoId}` +
                    `&nivelId=${instrumentoSelecionado.nivelId}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const texto = await response.text();

                if (!response.ok) {
                    throw new Error(
                        `Erro ao buscar disponibilidade: ${response.status}`
                    );
                }

                const dados: DisponibilidadeAPI[] =
                    JSON.parse(texto);

                if (!ativo) return;

                setDisponibilidade(dados);

                const professoresUnicos =
                    dados.filter(
                        (item, index, array) =>
                            array.findIndex(
                                (outro) =>
                                    outro.professor.id ===
                                    item.professor.id
                            ) === index
                    );

                if (professoresUnicos.length > 0) {
                    setProfessorSelecionado(
                        professoresUnicos[0].professor
                    );
                }

                const dias = criarDiasDisponiveis(dados);

                if (dias.length > 0) {
                    setDiaSelecionado(dias[0]);
                }
            } catch (error) {
                console.error(
                    'AGENDAMENTO: erro disponibilidade:',
                    error
                );

                if (!ativo) return;

                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar a disponibilidade.'
                );

                setDisponibilidade([]);
            } finally {
                if (ativo) {
                    setCarregandoDisponibilidade(false);
                }
            }
        }

        carregarDisponibilidade();

        return () => {
            ativo = false;
        };
    }, [instrumentoSelecionado]);

    const professores = useMemo(() => {
        const mapa = new Map<number, ProfessorAPI>();

        disponibilidade.forEach((item) => {
            if (!mapa.has(item.professor.id)) {
                mapa.set(item.professor.id, item.professor);
            }
        });

        return Array.from(mapa.values());
    }, [disponibilidade]);

    const dias = useMemo(() => {
        return criarDiasDisponiveis(disponibilidade).filter(
            (dia) =>
                disponibilidade.some(
                    (item) =>
                        item.professor.id ===
                        professorSelecionado?.id &&
                        item.data === dia.data &&
                        item.horarios.length > 0
                )
        );
    }, [disponibilidade, professorSelecionado]);

    const horarios = useMemo(() => {
        if (!professorSelecionado || !diaSelecionado) {
            return [];
        }

        const item = disponibilidade.find(
            (item) =>
                item.professor.id ===
                professorSelecionado.id &&
                item.data === diaSelecionado.data
        );

        return item?.horarios ?? [];
    }, [
        disponibilidade,
        professorSelecionado,
        diaSelecionado,
    ]);

    function selecionarInstrumento(
        instrumento: InstrumentoUsuario
    ) {
        setInstrumentoSelecionado(instrumento);
    }

    function selecionarProfessor(professor: ProfessorAPI) {
        setProfessorSelecionado(professor);

        const primeiroDia = criarDiasDisponiveis(
            disponibilidade.filter(
                (item) =>
                    item.professor.id === professor.id &&
                    item.horarios.length > 0
            )
        )[0];

        setDiaSelecionado(primeiroDia ?? null);
        setHorarioSelecionado(null);
    }

    function selecionarDia(dia: DiaDisponivel) {
        setDiaSelecionado(dia);
        setHorarioSelecionado(null);
    }

    function voltarParaInstrumentos() {
        setInstrumentoSelecionado(null);
        setDisponibilidade([]);
        setProfessorSelecionado(null);
        setDiaSelecionado(null);
        setHorarioSelecionado(null);
        setErro(null);
    }

    async function confirmarAgendamento() {
        if (!instrumentoSelecionado) {
            Alert.alert(
                'Instrumento',
                'Selecione um instrumento.'
            );
            return;
        }

        if (!professorSelecionado) {
            Alert.alert(
                'Professor',
                'Selecione um professor.'
            );
            return;
        }

        if (!diaSelecionado) {
            Alert.alert(
                'Data',
                'Selecione uma data.'
            );
            return;
        }

        if (!horarioSelecionado) {
            Alert.alert(
                'Horário',
                'Selecione um horário.'
            );
            return;
        }

        try {
            setConfirmando(true);

            const token = await getToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }

            const dataHora =
                `${diaSelecionado.data}T` +
                `${horarioSelecionado}:00-03:00`;

            const response = await fetch(
                `${API_URL}/agendamento`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        professorId:
                            professorSelecionado.id,

                        instrumentoId:
                            instrumentoSelecionado.instrumentoId,

                        nivelId:
                            instrumentoSelecionado.nivelId,

                        dataHora,
                    }),
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                let mensagem =
                    'Não foi possível realizar o agendamento.';

                try {
                    const erroAPI = JSON.parse(texto);

                    if (erroAPI.error) {
                        mensagem = erroAPI.error;
                    }
                } catch { }

                throw new Error(mensagem);
            }

            Alert.alert(
                'Aula agendada!',
                `Sua aula de ${instrumentoSelecionado.instrumento} foi agendada para ${formatarData(
                    diaSelecionado.data
                )} às ${horarioSelecionado}.`,
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            router.replace('/home'),
                    },
                ]
            );
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(
                    'Horário indisponível',
                    error.message
                );
                return;
            }

            Alert.alert(
                'Erro',
                'Não foi possível realizar o agendamento.'
            );
        } finally {
            setConfirmando(false);
        }
    }

    if (carregandoInstrumentos) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text style={styles.loadingTexto}>
                        Carregando seus instrumentos...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (erro && !instrumentoSelecionado) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.erroContainer}>
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={48}
                        color="#093373"
                    />

                    <Text style={styles.erroTitulo}>
                        Não foi possível carregar
                    </Text>

                    <Text style={styles.erroTexto}>
                        {erro}
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoErro}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.botaoErroTexto}>
                            Voltar
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!instrumentoSelecionado) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={
                        styles.instrumentosScroll
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.botaoVoltar}
                            onPress={() => router.back()}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color="#093373"
                            />

                            <Text style={styles.textoVoltar}>
                                Voltar
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.eyebrow}>
                            NOVO AGENDAMENTO
                        </Text>

                        <Text style={styles.titulo}>
                            Escolha seu instrumento
                        </Text>

                        <Text style={styles.subtitulo}>
                            Selecione o instrumento que deseja
                            estudar e encontre um horário
                            disponível.
                        </Text>
                    </View>

                    <View style={styles.instrucoesCard}>
                        <View style={styles.instrucoesIcone}>
                            <MaterialCommunityIcons
                                name="calendar"
                                size={26}
                                color="#093373"
                            />
                        </View>

                        <View style={styles.instrucoesInfo}>
                            <Text
                                style={
                                    styles.instrucoesTitulo
                                }
                            >
                                Agende sua próxima aula
                            </Text>

                            <Text
                                style={
                                    styles.instrucoesTexto
                                }
                            >
                                Você verá apenas os professores
                                que lecionam o instrumento e
                                nível escolhidos.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.listaTitulo}>
                        Meus instrumentos
                    </Text>

                    <Text style={styles.listaSubtitulo}>
                        Escolha qual aula deseja agendar
                    </Text>

                    <View style={styles.instrumentosLista}>
                        {instrumentos.map((item) => {
                            const icone =
                                getInstrumentIcon(
                                    item.instrumento
                                ) as IconeInstrumento;

                            const corNivel =
                                getCorNivel(item.nivel);

                            const estrelas =
                                obterEstrelasNivel(item.nivel);

                            return (
                                <TouchableOpacity
                                    key={`${item.instrumentoId}-${item.nivelId}`}
                                    style={
                                        styles.instrumentoCard
                                    }
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        selecionarInstrumento(
                                            item
                                        )
                                    }
                                >
                                    <View
                                        style={
                                            styles.instrumentoIcone
                                        }
                                    >
                                        {icone.familia ===
                                            'material' ? (
                                            <MaterialCommunityIcons
                                                name={icone.nome}
                                                size={29}
                                                color="#093373"
                                            />
                                        ) : (
                                            <FontAwesome5
                                                name={icone.nome}
                                                size={27}
                                                color="#093373"
                                            />
                                        )}
                                    </View>

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
                                            {item.instrumento}
                                        </Text>

                                        <View
                                            style={[
                                                styles.instrumentoNivel,
                                                {
                                                    backgroundColor:
                                                        corNivel.fundo,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.estrelas,
                                                    {
                                                        color: corNivel.cor,
                                                    },
                                                ]}
                                            >
                                                {estrelas}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.instrumentoNivelTexto,
                                                    {
                                                        color: corNivel.cor,
                                                    },
                                                ]}
                                            >
                                                {item.nivel}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={
                                            styles.instrumentoSeta
                                        }
                                    >
                                        <MaterialCommunityIcons
                                            name="chevron-right"
                                            size={25}
                                            color="#093373"
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {instrumentos.length === 0 && (
                        <View
                            style={
                                styles.instrumentosVazio
                            }
                        >
                            <MaterialCommunityIcons
                                name="music-off"
                                size={40}
                                color="#6B7280"
                            />

                            <Text
                                style={
                                    styles.instrumentosVazioTitulo
                                }
                            >
                                Nenhum instrumento cadastrado
                            </Text>

                            <Text
                                style={
                                    styles.instrumentosVazioTexto
                                }
                            >
                                Cadastre um instrumento antes
                                de agendar uma aula.
                            </Text>
                        </View>
                    )}

                    <View style={styles.espacoFooter} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (carregandoDisponibilidade) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#093373"
                    />

                    <Text style={styles.loadingTitulo}>
                        Buscando horários
                    </Text>

                    <Text style={styles.loadingTexto}>
                        Procurando professores e horários
                        disponíveis para{' '}
                        {instrumentoSelecionado.instrumento}.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (erro) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.erroContainer}>
                    <MaterialCommunityIcons
                        name="calendar-remove-outline"
                        size={48}
                        color="#093373"
                    />

                    <Text style={styles.erroTitulo}>
                        Não foi possível carregar os horários
                    </Text>

                    <Text style={styles.erroTexto}>
                        {erro}
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoErro}
                        onPress={voltarParaInstrumentos}
                    >
                        <Text style={styles.botaoErroTexto}>
                            Escolher outro instrumento
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const corNivelSelecionado =
        getCorNivel(instrumentoSelecionado.nivel);

    const estrelasNivelSelecionado =
        obterEstrelasNivel(instrumentoSelecionado.nivel);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.botaoVoltar}
                            onPress={voltarParaInstrumentos}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color="#093373"
                            />

                            <Text style={styles.textoVoltar}>
                                Instrumentos
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.eyebrow}>
                            AGENDAR AULA
                        </Text>

                        <View
                            style={styles.instrumentoHeader}
                        >
                            <View
                                style={
                                    styles.iconeInstrumento
                                }
                            >
                                {(() => {
                                    const icone =
                                        getInstrumentIcon(
                                            instrumentoSelecionado.instrumento
                                        ) as IconeInstrumento;

                                    return icone.familia ===
                                        'material' ? (
                                        <MaterialCommunityIcons
                                            name={icone.nome}
                                            size={29}
                                            color="#093373"
                                        />
                                    ) : (
                                        <FontAwesome5
                                            name={icone.nome}
                                            size={27}
                                            color="#093373"
                                        />
                                    );
                                })()}
                            </View>

                            <View
                                style={
                                    styles.instrumentoTituloContainer
                                }
                            >
                                <Text
                                    style={styles.titulo}
                                    numberOfLines={1}
                                >
                                    {
                                        instrumentoSelecionado.instrumento
                                    }
                                </Text>

                                <View
                                    style={[
                                        styles.nivelBadge,
                                        {
                                            backgroundColor:
                                                corNivelSelecionado.fundo,
                                            borderColor:
                                                corNivelSelecionado.cor,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.estrelasNivel,
                                            {
                                                color:
                                                    corNivelSelecionado.cor,
                                            },
                                        ]}
                                    >
                                        {
                                            estrelasNivelSelecionado
                                        }
                                    </Text>

                                    <Text
                                        style={[
                                            styles.nivelTexto,
                                            {
                                                color:
                                                    corNivelSelecionado.cor,
                                            },
                                        ]}
                                    >
                                        {
                                            instrumentoSelecionado.nivel
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.secao}>
                        <Text style={styles.secaoTitulo}>
                            Escolha seu professor
                        </Text>

                        <Text
                            style={styles.secaoDescricao}
                        >
                            Professores disponíveis para
                            este instrumento e nível.
                        </Text>

                        {professores.length === 0 ? (
                            <Text style={styles.vazioTexto}>
                                Nenhum professor disponível.
                            </Text>
                        ) : (
                            <View
                                style={
                                    styles.professoresContainer
                                }
                            >
                                {professores.map(
                                    (professor) => {
                                        const selecionado =
                                            professorSelecionado?.id ===
                                            professor.id;

                                        return (
                                            <TouchableOpacity
                                                key={
                                                    professor.id
                                                }
                                                style={[
                                                    styles.professorCard,
                                                    selecionado &&
                                                    styles.professorCardSelecionado,
                                                ]}
                                                activeOpacity={
                                                    0.8
                                                }
                                                onPress={() =>
                                                    selecionarProfessor(
                                                        professor
                                                    )
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.professorFotoContainer
                                                    }
                                                >
                                                    {professor.image ? (
                                                        <Image
                                                            source={{
                                                                uri: professor.image,
                                                            }}
                                                            style={
                                                                styles.professorFoto
                                                            }
                                                        />
                                                    ) : (
                                                        <View
                                                            style={
                                                                styles.professorFotoPlaceholder
                                                            }
                                                        >
                                                            <FontAwesome5
                                                                name="user"
                                                                size={
                                                                    24
                                                                }
                                                                color="#093373"
                                                            />
                                                        </View>
                                                    )}

                                                    {selecionado && (
                                                        <View
                                                            style={
                                                                styles.professorCheck
                                                            }
                                                        >
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
                                                    numberOfLines={
                                                        2
                                                    }
                                                >
                                                    {
                                                        professor.name
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.secao}>
                        <Text style={styles.secaoTitulo}>
                            Escolha o dia
                        </Text>

                        <Text style={styles.secaoDescricao}>
                            Veja as próximas datas com horários disponíveis.
                        </Text>

                        {dias.length === 0 ? (
                            <Text style={styles.vazioTexto}>
                                Nenhum dia disponível para este
                                professor.
                            </Text>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={
                                    false
                                }
                                contentContainerStyle={
                                    styles.diasContainer
                                }
                            >
                                {dias.map((dia) => {
                                    const selecionado =
                                        diaSelecionado?.data ===
                                        dia.data;

                                    return (
                                        <TouchableOpacity
                                            key={dia.data}
                                            style={[
                                                styles.diaCard,
                                                selecionado &&
                                                styles.diaCardSelecionado,
                                            ]}
                                            activeOpacity={
                                                0.8
                                            }
                                            onPress={() =>
                                                selecionarDia(
                                                    dia
                                                )
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.diaSemanaTexto,
                                                    selecionado &&
                                                    styles.diaTextoSelecionado,
                                                ]}
                                            >
                                                {
                                                    dia.diaSemana
                                                }
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
                        )}
                    </View>

                    <View style={styles.secao}>
                        <Text style={styles.secaoTitulo}>
                            Escolha o horário
                        </Text>

                        <Text
                            style={styles.secaoDescricao}
                        >
                            Selecione um dos horários
                            disponíveis.
                        </Text>

                        {horarios.length === 0 ? (
                            <Text style={styles.vazioTexto}>
                                Nenhum horário disponível para
                                este dia.
                            </Text>
                        ) : (
                            <View
                                style={
                                    styles.horariosContainer
                                }
                            >
                                {horarios.map((horario) => {
                                    const selecionado =
                                        horarioSelecionado ===
                                        horario;

                                    return (
                                        <TouchableOpacity
                                            key={horario}
                                            style={[
                                                styles.horarioCard,
                                                selecionado &&
                                                styles.horarioCardSelecionado,
                                            ]}
                                            activeOpacity={
                                                0.8
                                            }
                                            onPress={() =>
                                                setHorarioSelecionado(
                                                    horario
                                                )
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name="clock-outline"
                                                size={17}
                                                color={
                                                    selecionado
                                                        ? '#FFFFFF'
                                                        : '#093373'
                                                }
                                            />

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
                    </View>

                    {professorSelecionado &&
                        diaSelecionado &&
                        horarioSelecionado && (
                            <View style={styles.secao}>
                                <Text
                                    style={
                                        styles.secaoTitulo
                                    }
                                >
                                    Resumo
                                </Text>

                                <View
                                    style={
                                        styles.resumoCard
                                    }
                                >
                                    {professorSelecionado.image ? (
                                        <Image
                                            source={{
                                                uri: professorSelecionado.image,
                                            }}
                                            style={
                                                styles.resumoFoto
                                            }
                                        />
                                    ) : (
                                        <View
                                            style={
                                                styles.resumoFotoPlaceholder
                                            }
                                        >
                                            <FontAwesome5
                                                name="user"
                                                size={21}
                                                color="#093373"
                                            />
                                        </View>
                                    )}

                                    <View
                                        style={
                                            styles.resumoTextos
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.resumoInstrumento
                                            }
                                        >
                                            {
                                                instrumentoSelecionado.instrumento
                                            }{' '}
                                            ·{' '}
                                            {
                                                instrumentoSelecionado.nivel
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.resumoProfessor
                                            }
                                        >
                                            {
                                                professorSelecionado.name
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.resumoData
                                            }
                                        >
                                            {formatarData(
                                                diaSelecionado.data
                                            )}{' '}
                                            às{' '}
                                            {
                                                horarioSelecionado
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                    <View
                        style={styles.espacoFooter}
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.botaoConfirmar,
                            (!professorSelecionado ||
                                !diaSelecionado ||
                                !horarioSelecionado ||
                                confirmando) &&
                            styles.botaoConfirmarDesabilitado,
                        ]}
                        disabled={
                            !professorSelecionado ||
                            !diaSelecionado ||
                            !horarioSelecionado ||
                            confirmando
                        }
                        onPress={confirmarAgendamento}
                        activeOpacity={0.85}
                    >
                        {confirmando ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <>
                                <MaterialCommunityIcons
                                    name="calendar-check"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text
                                    style={
                                        styles.botaoConfirmarTexto
                                    }
                                >
                                    Confirmar agendamento
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}