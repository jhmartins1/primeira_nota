import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BORDA = '#E7EAF0';
const TEXTO_PRINCIPAL = '#1A1E29';
const TEXTO_SECUNDARIO = '#6B7280';
const DOURADO = '#B8842E';
const DOURADO_FUNDO = '#FBF1DE';
const VERMELHO_FUNDO = '#FFF1F0';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 40,
    },

    /*
    ========================================
    HEADER
    ========================================
    */

    header: {
        paddingTop: 8,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    botaoLogout: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: VERMELHO_FUNDO,
        borderWidth: 1,
        borderColor: '#F3D0CC',
        marginLeft: 12,
    },

    botaoLogoutCarregando: {
        backgroundColor: '#F8E3E1',
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: AZUL,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginBottom: 5,
    },

    titulo: {
        fontSize: 28,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    subtitulo: {
        fontSize: 14,
        color: TEXTO_SECUNDARIO,
        marginTop: 5,
    },

    /*
    ========================================
    SEM AULA
    ========================================
    */

    semAulaCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 24,
        alignItems: 'center',
        marginBottom: 28,
    },

    semAulaIcone: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },

    semAulaTitulo: {
        fontSize: 18,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginTop: 14,
        marginBottom: 7,
        textAlign: 'center',
    },

    semAulaTexto: {
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },

    /*
    ========================================
    SEÇÕES
    ========================================
    */

    secao: {
        marginBottom: 28,
    },

    secaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    secaoTitulo: {
        fontSize: 19,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 12,
    },

    secaoSubtitulo: {
        fontSize: 12,
        color: TEXTO_SECUNDARIO,
        marginTop: 3,
    },

    /*
    ========================================
    CARD DE AULA
    ========================================
    */

    listaAulas: {
        gap: 10,
    },

    aulaCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 16,
        padding: 16,

        shadowColor: '#0F1B3D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },

    aulaTopo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    aulaIcone: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    aulaInfo: {
        flex: 1,
    },

    aulaInstrumento: {
        fontSize: 17,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 5,
    },

    aulaNivel: {
        alignSelf: 'flex-start',
        fontSize: 12,
        fontWeight: '700',
        color: DOURADO,
        backgroundColor: DOURADO_FUNDO,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 3,
    },

    aulaDetalhes: {
        borderTopWidth: 1,
        borderTopColor: BORDA,
        paddingTop: 13,
        gap: 8,
    },

    aulaLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    aulaTexto: {
        fontSize: 13,
        color: TEXTO_PRINCIPAL,
        fontWeight: '600',
    },
    headerBotoes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 12,
    },

    botaoEditarInstrumentos: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: AZUL_CLARO,
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 11,
        height: 42,
    },

    botaoEditarInstrumentosTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: AZUL,
    },
    botaoCancelarAula: {
        height: 42,
        marginTop: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3D0CC',
        backgroundColor: '#FFF8F7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },

    botaoCancelarAulaTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: '#B42318',
    },
});