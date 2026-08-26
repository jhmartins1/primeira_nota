import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';

const FUNDO = '#F5F6FA';
const BORDA = '#E4E7EC';

const TEXTO_PRINCIPAL = '#1A1E29';
const TEXTO_SECUNDARIO = '#6B7280';

const DOURADO = '#B8842E';
const DOURADO_FUNDO = '#FBF1DE';

export const styles = StyleSheet.create({

    /*
     * =========================
     * CONTAINER
     * =========================
     */

    safeArea: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    /*
     * =========================
     * HEADER
     * =========================
     */

    header: {
        paddingHorizontal: 24,

        // Mais para cima no celular
        paddingTop: 4,

        paddingBottom: 10,
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',

        marginBottom: 10,
    },

    seta: {
        fontSize: 32,
        lineHeight: 32,
        color: AZUL,
        fontWeight: '400',
    },

    textoVoltar: {
        marginLeft: 4,
        fontSize: 16,
        color: AZUL,
        fontWeight: '600',
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',

        color: TEXTO_SECUNDARIO,

        textTransform: 'uppercase',
        letterSpacing: 0.6,

        marginBottom: 7,
    },

    /*
     * =========================
     * INSTRUMENTO + NÍVEL
     * =========================
     */

    instrumentoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    iconeInstrumento: {
        width: 48,
        height: 48,

        borderRadius: 14,

        backgroundColor: AZUL_CLARO,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    titulo: {
        flex: 1,

        fontSize: 24,
        fontWeight: '700',

        color: TEXTO_PRINCIPAL,
    },

    nivelBadge: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: DOURADO_FUNDO,

        borderWidth: 1,
        borderColor: '#F1DDAF',

        borderRadius: 10,

        paddingHorizontal: 9,
        paddingVertical: 7,

        marginLeft: 8,
    },

    estrelasNivel: {
        fontSize: 13,

        color: DOURADO,

        letterSpacing: 1,

        marginRight: 5,
    },

    nivelTexto: {
        fontSize: 12,
        fontWeight: '700',

        color: DOURADO,
    },

    /*
     * =========================
     * SCROLL
     * =========================
     */

    scrollContent: {
        paddingHorizontal: 24,

        paddingTop: 0,

        paddingBottom: 20,
    },

    /*
     * =========================
     * SEÇÕES
     * =========================
     */

    secaoTitulo: {
        fontSize: 18,
        fontWeight: '700',

        marginTop: 14,
        marginBottom: 5,

        color: TEXTO_PRINCIPAL,
    },

    secaoDescricao: {
        fontSize: 13,
        lineHeight: 19,

        color: TEXTO_SECUNDARIO,

        marginBottom: 14,
    },

    vazioTexto: {
        fontSize: 14,
        lineHeight: 20,

        color: TEXTO_SECUNDARIO,

        marginTop: 4,
    },

    /*
     * =========================
     * PROFESSORES
     * =========================
     */

    professoresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        gap: 12,
    },

    professorCard: {
        width: 100,

        alignItems: 'center',

        paddingVertical: 12,
        paddingHorizontal: 8,

        borderRadius: 14,

        borderWidth: 1.5,
        borderColor: BORDA,

        backgroundColor: '#fff',
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
        borderColor: '#fff',
    },

    professorCheckTexto: {
        color: '#fff',

        fontSize: 11,
        fontWeight: '700',
    },

    professorNome: {
        fontSize: 12,

        textAlign: 'center',

        fontWeight: '600',

        color: TEXTO_PRINCIPAL,
    },

    professorNomeSelecionado: {
        color: AZUL,
    },

    /*
     * =========================
     * DIAS
     * =========================
     */

    diasContainer: {
        gap: 10,

        paddingBottom: 4,
    },

    diaCard: {
        width: 62,
        height: 70,

        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 14,

        borderWidth: 1.5,
        borderColor: BORDA,

        backgroundColor: '#fff',
    },

    diaCardSelecionado: {
        borderColor: AZUL,
        backgroundColor: AZUL_CLARO,
    },

    diaCardDesabilitado: {
        opacity: 0.35,
    },

    diaSemanaTexto: {
        fontSize: 12,

        fontWeight: '500',

        color: TEXTO_SECUNDARIO,

        textTransform: 'capitalize',
    },

    diaMesTexto: {
        fontSize: 18,

        fontWeight: '700',

        marginTop: 4,

        color: TEXTO_PRINCIPAL,
    },

    diaTextoSelecionado: {
        color: AZUL,
    },

    /*
     * =========================
     * HORÁRIOS
     * =========================
     */

    horariosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        gap: 10,
    },

    horarioCard: {
        minWidth: 78,

        paddingVertical: 11,
        paddingHorizontal: 15,

        borderRadius: 12,

        borderWidth: 1.5,
        borderColor: BORDA,

        backgroundColor: '#fff',

        alignItems: 'center',
    },

    horarioCardSelecionado: {
        borderColor: AZUL,
        backgroundColor: AZUL,
    },

    horarioTexto: {
        fontSize: 14,

        fontWeight: '600',

        color: TEXTO_PRINCIPAL,
    },

    horarioTextoSelecionado: {
        color: '#fff',
    },

    /*
     * =========================
     * RESUMO
     * =========================
     */

    resumoCard: {
        flexDirection: 'row',
        alignItems: 'center',

        padding: 16,

        borderRadius: 16,

        backgroundColor: DOURADO_FUNDO,

        borderWidth: 1,
        borderColor: '#F1DDAF',

        // Espaço antes do botão
        marginBottom: 12,
    },

    resumoFoto: {
        width: 52,
        height: 52,

        borderRadius: 26,
    },

    resumoTextos: {
        flex: 1,

        marginLeft: 13,
    },

    resumoInstrumento: {
        fontSize: 13,

        color: DOURADO,

        fontWeight: '700',
    },

    resumoProfessor: {
        fontSize: 16,

        fontWeight: '700',

        marginTop: 3,

        color: TEXTO_PRINCIPAL,
    },

    resumoData: {
        fontSize: 13,

        color: TEXTO_SECUNDARIO,

        marginTop: 4,
    },

    /*
     * =========================
     * ESPAÇO DO FOOTER
     * =========================
     */

    espacoFooter: {
        height: 20,
    },

    /*
     * =========================
     * FOOTER
     * =========================
     */

    footer: {
        paddingHorizontal: 24,

        paddingTop: 10,
        paddingBottom: 10,

        backgroundColor: FUNDO,

        borderTopWidth: 1,
        borderTopColor: '#E9EBF0',
    },

    botaoConfirmar: {
        width: '100%',

        backgroundColor: AZUL,

        paddingVertical: 16,

        borderRadius: 14,

        alignItems: 'center',
    },

    botaoConfirmarTexto: {
        color: '#fff',

        fontWeight: '700',

        fontSize: 15,
    },
});