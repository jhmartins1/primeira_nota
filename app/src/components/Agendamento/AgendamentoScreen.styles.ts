import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BORDA = '#E4E7EC';
const TEXTO_PRINCIPAL = '#1A1E29';
const TEXTO_SECUNDARIO = '#6B7280';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 35,
    },

    loadingTitulo: {
        marginTop: 18,
        fontSize: 19,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        textAlign: 'center',
    },

    loadingTexto: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },

    erroContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    erroTitulo: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        textAlign: 'center',
        marginBottom: 8,
    },

    erroTexto: {
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
        marginBottom: 22,
    },

    botaoErro: {
        backgroundColor: AZUL,
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderRadius: 12,
    },

    botaoErroTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    instrumentosScroll: {
        paddingHorizontal: 22,
        paddingTop: 12,
        paddingBottom: 30,
    },

    header: {
        paddingTop: 4,
        paddingBottom: 18,
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 22,
    },

    textoVoltar: {
        marginLeft: 5,
        fontSize: 15,
        color: AZUL,
        fontWeight: '600',
    },

    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        color: AZUL,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginBottom: 7,
    },

    titulo: {
        fontSize: 26,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    subtitulo: {
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        marginTop: 7,
    },

    instrucoesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AZUL_CLARO,
        borderRadius: 18,
        padding: 16,
        marginBottom: 26,
    },

    instrucoesIcone: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    instrucoesInfo: {
        flex: 1,
    },

    instrucoesTitulo: {
        fontSize: 14,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 4,
    },

    instrucoesTexto: {
        fontSize: 12,
        lineHeight: 18,
        color: TEXTO_SECUNDARIO,
    },

    listaTitulo: {
        fontSize: 19,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    listaSubtitulo: {
        fontSize: 13,
        color: TEXTO_SECUNDARIO,
        marginTop: 3,
        marginBottom: 13,
    },

    instrumentosLista: {
        gap: 10,
    },

    instrumentoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 17,
        padding: 14,
    },

    instrumentoIcone: {
        width: 52,
        height: 52,
        borderRadius: 15,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    instrumentoInfo: {
        flex: 1,
    },

    instrumentoNome: {
        fontSize: 16,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 5,
    },

    instrumentoNivel: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    estrelas: {
        fontSize: 13,
        fontWeight: '800',
        marginRight: 5,
    },

    instrumentoNivelTexto: {
        fontSize: 12,
        fontWeight: '700',
    },

    instrumentoSeta: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F7F8FB',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    instrumentosVazio: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 17,
        padding: 28,
        alignItems: 'center',
    },

    instrumentosVazioTitulo: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        textAlign: 'center',
    },

    instrumentosVazioTexto: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },

    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 4,
        paddingBottom: 20,
    },

    instrumentoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },

    iconeInstrumento: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    instrumentoTituloContainer: {
        flex: 1,
    },

    nivelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
        marginTop: 6,
    },

    estrelasNivel: {
        fontSize: 12,
        fontWeight: '800',
        marginRight: 5,
    },

    nivelTexto: {
        fontSize: 11,
        fontWeight: '800',
    },

    secao: {
        marginBottom: 27,
    },

    secaoTitulo: {
        fontSize: 18,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 5,
    },

    secaoDescricao: {
        fontSize: 13,
        lineHeight: 19,
        color: TEXTO_SECUNDARIO,
        marginBottom: 13,
    },

    vazioTexto: {
        fontSize: 13,
        lineHeight: 19,
        color: TEXTO_SECUNDARIO,
        marginTop: 2,
    },

    professoresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    professorCard: {
        width: 105,
        minHeight: 132,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 7,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: BORDA,
        backgroundColor: '#FFFFFF',
    },

    professorCardSelecionado: {
        borderColor: AZUL,
        backgroundColor: AZUL_CLARO,
    },

    professorFotoContainer: {
        position: 'relative',
        marginBottom: 8,
    },

    professorFoto: {
        width: 62,
        height: 62,
        borderRadius: 31,
    },

    professorFotoPlaceholder: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
    },

    professorCheck: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 21,
        height: 21,
        borderRadius: 11,
        backgroundColor: AZUL,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    professorCheckTexto: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },

    professorNome: {
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
        fontWeight: '600',
        color: TEXTO_PRINCIPAL,
    },

    professorNomeSelecionado: {
        color: AZUL,
        fontWeight: '800',
    },

    diasContainer: {
        gap: 9,
        paddingRight: 5,
    },

    diaCard: {
        width: 64,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: BORDA,
        backgroundColor: '#FFFFFF',
    },

    diaCardSelecionado: {
        borderColor: AZUL,
        backgroundColor: AZUL_CLARO,
    },

    diaSemanaTexto: {
        fontSize: 11,
        fontWeight: '600',
        color: TEXTO_SECUNDARIO,
        textTransform: 'capitalize',
    },

    diaMesTexto: {
        fontSize: 19,
        fontWeight: '800',
        marginTop: 4,
        color: TEXTO_PRINCIPAL,
    },

    diaTextoSelecionado: {
        color: AZUL,
    },

    horariosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
    },

    horarioCard: {
        minWidth: 84,
        height: 45,
        paddingHorizontal: 13,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: BORDA,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },

    horarioCardSelecionado: {
        borderColor: AZUL,
        backgroundColor: AZUL,
    },

    horarioTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: TEXTO_PRINCIPAL,
    },

    horarioTextoSelecionado: {
        color: '#FFFFFF',
    },

    resumoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 17,
        backgroundColor: '#FBF1DE',
        borderWidth: 1,
        borderColor: '#F1DDAF',
    },

    resumoFoto: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },

    resumoFotoPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    resumoTextos: {
        flex: 1,
        marginLeft: 13,
    },

    resumoInstrumento: {
        fontSize: 12,
        color: '#B8842E',
        fontWeight: '800',
    },

    resumoProfessor: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 3,
        color: TEXTO_PRINCIPAL,
    },

    resumoData: {
        fontSize: 13,
        color: TEXTO_SECUNDARIO,
        marginTop: 4,
    },

    espacoFooter: {
        height: 25,
    },

    footer: {
        paddingHorizontal: 22,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: FUNDO,
        borderTopWidth: 1,
        borderTopColor: '#E9EBF0',
    },

    botaoConfirmar: {
        width: '100%',
        minHeight: 54,
        backgroundColor: AZUL,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    botaoConfirmarDesabilitado: {
        opacity: 0.45,
    },

    botaoConfirmarTexto: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
});