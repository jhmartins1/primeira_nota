import {
    StyleSheet,
} from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BRANCO = '#FFFFFF';
const TEXTO = '#1A1E29';
const TEXTO_SECUNDARIO =
    '#6B7280';
const BORDA = '#E3E7EF';
const DOURADO = '#B8842E';

export const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                FUNDO,
        },

        loadingContainer: {
            flex: 1,
            alignItems:
                'center',
            justifyContent:
                'center',
            paddingHorizontal:
                30,
        },

        loadingTexto: {
            marginTop: 12,
            fontSize: 14,
            color:
                TEXTO_SECUNDARIO,
            textAlign:
                'center',
        },

        // --------------------------------
        // HEADER
        // --------------------------------

        header: {
            height: 74,
            paddingHorizontal:
                18,
            flexDirection:
                'row',
            alignItems:
                'center',
            backgroundColor:
                BRANCO,
            borderBottomWidth:
                1,
            borderBottomColor:
                BORDA,
        },

        botaoVoltar: {
            width: 42,
            height: 42,
            borderRadius: 13,
            alignItems:
                'center',
            justifyContent:
                'center',
            backgroundColor:
                AZUL_CLARO,
        },

        headerTexto: {
            flex: 1,
            paddingHorizontal:
                13,
        },

        titulo: {
            fontSize: 20,
            fontWeight:
                '800',
            color: TEXTO,
        },

        subtitulo: {
            marginTop: 2,
            fontSize: 12,
            color:
                TEXTO_SECUNDARIO,
        },

        headerEspaco: {
            width: 42,
        },

        scrollContent: {
            padding: 18,
        },

        // --------------------------------
        // RESUMO DA AULA
        // --------------------------------

        cardResumo: {
            padding: 16,
            borderRadius: 18,
            backgroundColor:
                BRANCO,
            borderWidth: 1,
            borderColor:
                BORDA,
            flexDirection:
                'row',
            alignItems:
                'center',
        },

        resumoIcone: {
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor:
                AZUL_CLARO,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        resumoConteudo: {
            flex: 1,
            marginLeft: 14,
        },

        resumoInstrumento: {
            fontSize: 17,
            fontWeight:
                '800',
            color: TEXTO,
        },

        resumoNivel: {
            marginTop: 3,
            fontSize: 13,
            fontWeight:
                '600',
            color: AZUL,
        },

        resumoProfessorLinha: {
            marginTop: 7,
            flexDirection:
                'row',
            alignItems:
                'center',
            gap: 5,
        },

        resumoProfessor: {
            flex: 1,
            fontSize: 13,
            color:
                TEXTO_SECUNDARIO,
        },

        // --------------------------------
        // HORÁRIO ATUAL
        // --------------------------------

        cardAtual: {
            marginTop: 13,
            padding: 15,
            borderRadius: 16,
            borderWidth: 1,
            borderColor:
                '#EADFCB',
            backgroundColor:
                '#FFFBF4',
        },

        atualCabecalho: {
            flexDirection:
                'row',
            alignItems:
                'center',
        },

        atualIcone: {
            width: 42,
            height: 42,
            marginRight: 11,
            borderRadius: 12,
            alignItems:
                'center',
            justifyContent:
                'center',
            backgroundColor:
                '#F7ECD8',
        },

        atualLabel: {
            fontSize: 10,
            fontWeight:
                '800',
            color: DOURADO,
            letterSpacing:
                0.7,
        },

        atualTexto: {
            marginTop: 3,
            fontSize: 15,
            fontWeight:
                '800',
            color: TEXTO,
        },

        atualAviso: {
            marginTop: 11,
            fontSize: 12,
            lineHeight: 18,
            color:
                TEXTO_SECUNDARIO,
        },

        // --------------------------------
        // SEÇÕES
        // --------------------------------

        secao: {
            marginTop: 24,
        },

        secaoTituloLinha: {
            flexDirection:
                'row',
            alignItems:
                'center',
        },

        numeroEtapa: {
            width: 32,
            height: 32,
            marginRight: 10,
            borderRadius: 10,
            backgroundColor:
                AZUL,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        numeroEtapaTexto: {
            fontSize: 13,
            fontWeight:
                '800',
            color: BRANCO,
        },

        secaoTitulo: {
            fontSize: 17,
            fontWeight:
                '800',
            color: TEXTO,
        },

        secaoSubtitulo: {
            marginTop: 2,
            fontSize: 12,
            color:
                TEXTO_SECUNDARIO,
        },

        // --------------------------------
        // DATAS
        // --------------------------------

        listaDatas: {
            paddingTop: 15,
            paddingBottom: 3,
            gap: 9,
        },

        dataCard: {
            width: 78,
            minHeight: 94,
            paddingVertical: 11,
            paddingHorizontal:
                8,
            borderRadius: 15,
            borderWidth: 1,
            borderColor:
                BORDA,
            backgroundColor:
                BRANCO,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        dataCardSelecionado: {
            borderColor:
                AZUL,
            backgroundColor:
                AZUL,
        },

        dataDiaSemana: {
            fontSize: 11,
            fontWeight:
                '700',
            color:
                TEXTO_SECUNDARIO,
        },

        dataNumero: {
            marginTop: 3,
            fontSize: 24,
            fontWeight:
                '800',
            color: TEXTO,
        },

        dataMes: {
            marginTop: 1,
            fontSize: 11,
            fontWeight:
                '600',
            color:
                TEXTO_SECUNDARIO,
        },

        dataTextoSelecionado: {
            color:
                BRANCO,
        },

        // --------------------------------
        // HORÁRIOS
        // --------------------------------

        horariosGrid: {
            marginTop: 15,
            flexDirection:
                'row',
            flexWrap:
                'wrap',
            gap: 9,
        },

        horarioCard: {
            width:
                '31%',
            minWidth: 95,
            height: 48,
            paddingHorizontal:
                10,
            borderRadius: 13,
            borderWidth: 1,
            borderColor:
                '#D8E2F0',
            backgroundColor:
                BRANCO,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            gap: 6,
        },

        horarioCardSelecionado: {
            borderColor:
                AZUL,
            backgroundColor:
                AZUL,
        },

        horarioTexto: {
            fontSize: 14,
            fontWeight:
                '700',
            color: AZUL,
        },

        horarioTextoSelecionado: {
            color:
                BRANCO,
        },

        // --------------------------------
        // SEM DISPONIBILIDADE
        // --------------------------------

        semDisponibilidade: {
            marginTop: 15,
            paddingVertical:
                25,
            paddingHorizontal:
                20,
            borderRadius: 17,
            borderWidth: 1,
            borderColor:
                BORDA,
            backgroundColor:
                BRANCO,
            alignItems:
                'center',
        },

        semDisponibilidadeTitulo: {
            marginTop: 9,
            fontSize: 15,
            fontWeight:
                '800',
            color: TEXTO,
        },

        semDisponibilidadeTexto: {
            marginTop: 6,
            maxWidth: 280,
            fontSize: 12,
            lineHeight: 18,
            color:
                TEXTO_SECUNDARIO,
            textAlign:
                'center',
        },

        botaoAtualizar: {
            marginTop: 14,
            height: 39,
            paddingHorizontal:
                16,
            borderRadius: 11,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            gap: 6,
            backgroundColor:
                AZUL_CLARO,
        },

        botaoAtualizarTexto: {
            fontSize: 12,
            fontWeight:
                '700',
            color: AZUL,
        },

        // --------------------------------
        // CONFIRMAÇÃO
        // --------------------------------

        cardConfirmacao: {
            marginTop: 24,
            padding: 15,
            borderRadius: 16,
            borderWidth: 1,
            borderColor:
                '#D6E1F0',
            backgroundColor:
                AZUL_CLARO,
            flexDirection:
                'row',
            alignItems:
                'center',
        },

        confirmacaoTextoContainer: {
            flex: 1,
            marginLeft: 11,
        },

        confirmacaoLabel: {
            fontSize: 10,
            fontWeight:
                '800',
            letterSpacing:
                0.7,
            color: AZUL,
        },

        confirmacaoTexto: {
            marginTop: 3,
            fontSize: 15,
            fontWeight:
                '800',
            color: TEXTO,
        },

        espacoFinal: {
            height: 105,
        },

        // --------------------------------
        // FOOTER
        // --------------------------------

        footer: {
            position:
                'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal:
                18,
            paddingTop: 12,
            paddingBottom: 16,
            backgroundColor:
                BRANCO,
            borderTopWidth:
                1,
            borderTopColor:
                BORDA,
        },

        botaoConfirmar: {
            height: 52,
            borderRadius: 15,
            backgroundColor:
                AZUL,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            gap: 8,
            shadowColor:
                '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity:
                0.12,
            shadowRadius: 7,
            elevation: 3,
        },

        botaoConfirmarDesabilitado: {
            opacity: 0.45,
        },

        botaoConfirmarTexto: {
            fontSize: 15,
            fontWeight:
                '800',
            color: BRANCO,
        },
    });