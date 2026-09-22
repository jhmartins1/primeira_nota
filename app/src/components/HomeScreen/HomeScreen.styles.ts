import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

const AZUL = colors.navy;
const AZUL_CLARO = colors.tealSoft;
const FUNDO = colors.background;
const BORDA = colors.border;
const TEXTO_PRINCIPAL = colors.text;
const TEXTO_SECUNDARIO = colors.textSecondary;
const DOURADO = colors.amberText;
const DOURADO_FUNDO = colors.yellowSoft;
const VERDE = colors.success;
const VERDE_FUNDO = colors.successSoft;
const VERMELHO = colors.danger;
const VERMELHO_FUNDO = colors.dangerSoft;

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

        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.dangerBorder,
    },

    botaoLogoutCarregando: {
        opacity: 0.7,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.teal,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginBottom: 5,
    },

    titulo: {
        letterSpacing: -0.8,
        fontSize: 28,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    subtitulo: {
        lineHeight: 21,
        fontSize: 14,
        color: TEXTO_SECUNDARIO,
        marginTop: 5,
    },

    proximaAulaCard: {
        borderTopWidth: 4,
        borderTopColor: colors.turquoise,
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 20,
        marginBottom: 28,

        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.045,
        shadowRadius: 16,
        elevation: 2,
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
        color: colors.teal,
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
        borderRadius: 20,
        backgroundColor: colors.yellowSoft,
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
        shadowColor: colors.navy,
        shadowOpacity: 0.045,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
        backgroundColor: colors.tealSoft,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.tealBorder,
        padding: 24,
        alignItems: 'center',
        marginBottom: 28,
    },

    semAulaIcone: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: colors.surface,
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
        color: colors.surface,
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
        shadowColor: colors.navy,
        shadowOpacity: 0.045,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 22,
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
        borderRadius: 16,
        backgroundColor: colors.orangeSoft,
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

        borderColor: colors.dangerBorder,

        backgroundColor: colors.dangerSoft,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'center',

        gap: 7,
    },

    botaoCancelarAulaTexto: {
        fontSize: 13,

        fontWeight: '700',

        color: colors.danger,
    },

    listaVazia: {
        backgroundColor: colors.surface,
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
        backgroundColor: colors.yellow,
        borderRadius: 22,
        minHeight: 84,
        paddingHorizontal: 18,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,

        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 3,
    },

    botaoAgendarIcone: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    botaoAgendarInfo: {
        flex: 1,
    },

    botaoAgendarTitulo: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.navy,
        marginBottom: 3,
    },

    botaoAgendarSubtitulo: {
        lineHeight: 17,
        fontSize: 12,
        color: colors.navy,
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
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 18,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },

    instrumentoIcone: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: colors.yellowSoft,
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
        backgroundColor: colors.surface,
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

        backgroundColor: colors.tealSoft,

        borderWidth: 1,
        borderColor: colors.tealBorder,
    },
    botaoWhatsApp: {
        height: 44,

        borderRadius: 12,

        backgroundColor: colors.success,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'center',

        gap: 7,

        shadowColor: colors.success,

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

        color: colors.surface,
    },

    botaoRemarcarAula: {
        height: 42,
        marginTop: 10,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: colors.tealBorder,
        backgroundColor: colors.surfaceMuted,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },

    botaoRemarcarAulaTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.navy,
    },

});