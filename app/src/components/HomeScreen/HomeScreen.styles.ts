import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BORDA = '#E7EAF0';
const TEXTO_PRINCIPAL = '#1A1E29';
const TEXTO_SECUNDARIO = '#6B7280';
const DOURADO = '#B8842E';
const DOURADO_FUNDO = '#FBF1DE';
const VERDE = '#2E8B57';
const VERDE_FUNDO = '#EAF6EF';
const VERMELHO = '#B42318';
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
    header: {
        paddingTop: 8,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    botaoLogout: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#FEF2F2',

        borderWidth: 1,
        borderColor: '#FDE2E2',
    },

    botaoLogoutCarregando: {
        opacity: 0.7,
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

    proximaAulaCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 18,
        marginBottom: 28,

        shadowColor: '#0F1B3D',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },

    proximaAulaTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },

    proximaAulaLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: AZUL,
        letterSpacing: 1.2,
    },

    proximaAulaStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: VERDE_FUNDO,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
    },

    statusPonto: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: VERDE,
    },

    statusTexto: {
        fontSize: 11,
        fontWeight: '700',
        color: VERDE,
    },

    proximaAulaConteudo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    proximaAulaIcone: {
        width: 58,
        height: 58,
        borderRadius: 17,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    proximaAulaInfo: {
        flex: 1,
    },

    proximaAulaInstrumento: {
        fontSize: 21,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        marginBottom: 7,
    },

    proximaAulaNivel: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        backgroundColor: DOURADO_FUNDO,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },

    proximaAulaNivelTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: DOURADO,
    },

    proximaAulaDetalhes: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: BORDA,
        borderBottomWidth: 1,
        borderBottomColor: BORDA,
        paddingVertical: 15,
        marginBottom: 14,
    },
    detalheItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },

    detalheLabel: {
        fontSize: 11,
        color: TEXTO_SECUNDARIO,
        marginBottom: 2,
    },

    detalheValor: {
        fontSize: 14,
        fontWeight: '700',
        color: TEXTO_PRINCIPAL,
    },

    detalheSubvalor: {
        fontSize: 12,
        color: TEXTO_SECUNDARIO,
        marginTop: 1,
    },

    professorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    professorIcone: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    professorInfo: {
        flex: 1,
    },

    professorNome: {
        fontSize: 14,
        fontWeight: '700',
        color: TEXTO_PRINCIPAL,
    },
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
        marginBottom: 7,
        textAlign: 'center',
    },

    semAulaTexto: {
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },

    semAulaBotao: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        backgroundColor: AZUL,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 11,
    },

    semAulaBotaoTexto: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
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
    },

    secaoContador: {
        fontSize: 14,
        fontWeight: '600',
        color: TEXTO_SECUNDARIO,
    },

    secaoSubtitulo: {
        fontSize: 12,
        color: TEXTO_SECUNDARIO,
        marginTop: 3,
    },

    verTodas: {
        fontSize: 13,
        fontWeight: '700',
        color: AZUL,
    },
    listaAulas: {
        gap: 10,
    },
    aulaCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 16,
        padding: 16,
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
    },

    aulaDataLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 9,
    },

    aulaData: {
        fontSize: 13,
        color: TEXTO_PRINCIPAL,
        fontWeight: '600',
    },

    /*
    ========================================
    CHIP DE DATA/HORA (AulaCard)
    ========================================
    */

    aulaDataChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: AZUL_CLARO,
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 12,
        marginBottom: 12,
    },

    aulaDataChipTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: AZUL,
        flexShrink: 1,
    },

    aulaDataChipDia: {
        fontWeight: '500',
        color: AZUL,
        opacity: 0.75,
    },

    aulaProfessorLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    aulaProfessor: {
        fontSize: 13,
        color: TEXTO_SECUNDARIO,
    },

    /*
    ========================================
    PROFESSOR (avatar pequeno no AulaCard)
    ========================================
    */

    professorAvatarPequeno: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: BORDA,
    },

    professorAvatarPequenoFallback: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
    },

    professorAvatarPequenoIniciais: {
        fontSize: 10,
        fontWeight: '800',
        color: AZUL,
    },

    aulaDetalhes: {
        borderTopWidth: 1,
        borderTopColor: BORDA,
        paddingTop: 13,
        marginBottom: 12,
    },

    botaoCancelarAula: {
        height: 42,

        marginTop: 10,

        borderRadius: 11,

        borderWidth: 1,

        borderColor: '#E5D0CE',

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

    listaVazia: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 18,
        alignItems: 'center',
    },

    listaVaziaTexto: {
        fontSize: 13,
        color: TEXTO_SECUNDARIO,
    },
    botaoAgendar: {
        backgroundColor: AZUL,
        borderRadius: 17,
        minHeight: 72,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,

        shadowColor: '#093373',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },

    botaoAgendarIcone: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    botaoAgendarInfo: {
        flex: 1,
    },

    botaoAgendarTitulo: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 3,
    },

    botaoAgendarSubtitulo: {
        fontSize: 11,
        color: '#DCE6F5',
    },

    /*
    ========================================
    MEUS INSTRUMENTOS
    ========================================
    */

    botaoEditarInstrumentos: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: AZUL_CLARO,
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 11,
    },

    botaoEditarInstrumentosTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: AZUL,
    },

    instrumentosLista: {
        gap: 9,
    },

    instrumentoCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 16,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },

    instrumentoIcone: {
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    instrumentoInfo: {
        flex: 1,
    },

    instrumentoNome: {
        fontSize: 15,
        fontWeight: '700',
        color: TEXTO_PRINCIPAL,
        marginBottom: 4,
    },

    instrumentoNivel: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },

    instrumentoNivelTexto: {
        fontSize: 12,
        fontWeight: '600',
    },

    instrumentosVazio: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 20,
        alignItems: 'center',
    },

    instrumentosVazioTexto: {
        fontSize: 13,
        color: TEXTO_SECUNDARIO,
        marginBottom: 8,
    },

    instrumentosVazioLink: {
        fontSize: 13,
        fontWeight: '700',
        color: AZUL,
    },
    // =========================
    // AÇÕES DO HEADER
    // =========================

    acoesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    botaoPerfil: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#EAF0FB',

        borderWidth: 1,
        borderColor: '#DCE6F5',
    },
    botaoWhatsApp: {
        height: 44,

        borderRadius: 12,

        backgroundColor: '#25D366',

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'center',

        gap: 7,

        shadowColor: '#25D366',

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.15,

        shadowRadius: 6,

        elevation: 2,
    },

    botaoWhatsAppTexto: {
        fontSize: 13,

        fontWeight: '700',

        color: '#FFFFFF',
    },


});