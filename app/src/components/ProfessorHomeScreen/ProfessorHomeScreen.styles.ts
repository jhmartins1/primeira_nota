import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

const AZUL = colors.navy;
const AZUL_CLARO = colors.tealSoft;
const FUNDO = colors.background;
const BORDA = colors.border;

const TEXTO_PRINCIPAL = colors.text;
const TEXTO_SECUNDARIO = colors.textSecondary;

const VERMELHO = colors.danger;
const VERMELHO_FUNDO = colors.dangerSoft;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 40,
    },

    /*
    LOADING
    */

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingTexto: {
        marginTop: 12,
        color: TEXTO_SECUNDARIO,
        fontSize: 14,
    },

    /*
    ERRO
    */

    erroContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    erroTitulo: {
        marginTop: 15,
        fontSize: 19,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
        textAlign: 'center',
    },

    erroTexto: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },

    botaoTentarNovamente: {
        marginTop: 20,
        backgroundColor: AZUL,
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderRadius: 12,
    },

    botaoTentarNovamenteTexto: {
        color: colors.surface,
        fontWeight: '700',
    },

    /*
    HEADER
    */

    header: {
        paddingTop: 4,
        paddingBottom: 20,
    },

    headerTopo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    headerSaudacao: {
        width: '100%',
    },

    headerBotoes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        flexShrink: 0,
    },

    eyebrow: {
        flex: 1,
        flexShrink: 1,
        fontSize: 10.5,
        lineHeight: 14,
        fontWeight: '800',
        color: colors.teal,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        paddingRight: 8,
    },

    titulo: {
        letterSpacing: -0.8,
        fontSize: 29,
        lineHeight: 35,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    subtitulo: {
        fontSize: 14,
        lineHeight: 20,
        color: TEXTO_SECUNDARIO,
        marginTop: 4,
    },

    /*
    BOTÕES DO HEADER
    */

    botaoHorarios: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingHorizontal: 11,
        borderRadius: 20,
        backgroundColor: AZUL_CLARO,
    },

    botaoHorariosTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: AZUL,
    },

    botaoAcaoCircular: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AZUL_CLARO,
    },

    botaoLogout: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: VERMELHO_FUNDO,
        borderWidth: 1,
        borderColor: colors.dangerBorder,
    },

    botaoLogoutCarregando: {
        backgroundColor: colors.dangerBorder,
    },

    /*
    INSTRUMENTOS
    */

    instrumentosContainer: {
        marginTop: 18,
    },

    instrumentosLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: TEXTO_SECUNDARIO,
        marginBottom: 10,
    },

    instrumentosLista: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },




    instrumentoIconeCard: {
        width: 50,
        height: 50,
        borderRadius: 16,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.yellowSoft,

        borderWidth: 1,
        borderColor: colors.yellowBorder,
    },

    /*
    SEM AULA
    */

    semAulaCard: {
        backgroundColor: colors.tealSoft,

        borderRadius: 22,

        borderWidth: 1,
        borderColor: colors.tealBorder,

        padding: 24,

        alignItems: 'center',

        marginBottom: 28,

        shadowColor: colors.navy,

        shadowOffset: { width: 0, height: 5 },

        shadowOpacity: 0.045,
        shadowRadius: 16,

        elevation: 2,
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
    SEÇÕES
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

    /*
    LISTA DE AULAS
    */

    listaAulas: {
        gap: 10,
    },

    /*
    CARD DE AULA
    */

    aulaCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: BORDA,

        borderRadius: 22,

        padding: 16,

        marginTop: 10,

        overflow: 'visible',

        shadowColor: colors.navy,

        shadowOffset: { width: 0, height: 5 },

        shadowOpacity: 0.045,
        shadowRadius: 16,

        elevation: 2,
    },

    aulaCardDestaque: {
        borderTopWidth: 4,
        borderColor: colors.teal,
        borderWidth: 1.5,

        backgroundColor: colors.surface,

        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 3,
    },

    aulaCardBadge: {
        position: 'absolute',

        top: -10,
        left: 16,

        flexDirection: 'row',
        alignItems: 'center',

        gap: 4,

        backgroundColor: colors.teal,

        borderRadius: 20,

        paddingHorizontal: 10,
        paddingVertical: 4,

        zIndex: 2,
    },

    aulaCardBadgeTexto: {
        fontSize: 10,
        fontWeight: '800',

        color: colors.surface,

        letterSpacing: 0.6,
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

        marginBottom: 5,
    },

    aulaNivel: {
        alignSelf: 'flex-start',

        fontSize: 12,
        fontWeight: '700',

        color: colors.text,

        backgroundColor: colors.surfaceMuted,

        borderRadius: 20,

        paddingHorizontal: 9,
        paddingVertical: 3,
    },

    /*
    CHIP DATA / HORA
    */

    aulaDataChip: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 7,

        backgroundColor: AZUL_CLARO,

        borderRadius: 12,

        paddingVertical: 9,
        paddingHorizontal: 12,

        marginBottom: 13,
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

    /*
    DETALHES DA AULA
    */

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
        flex: 1,

        fontSize: 13,
        lineHeight: 18,

        color: TEXTO_PRINCIPAL,

        fontWeight: '600',
    },

    /*
    BOTÃO VER ENDEREÇO
    */

    botaoVerEndereco: {
        height: 42,

        marginTop: 12,

        borderRadius: 11,

        backgroundColor: AZUL,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        gap: 7,
    },

    botaoVerEnderecoTexto: {
        fontSize: 13,
        fontWeight: '700',

        color: colors.surface,
    },

    /*
    BOTÃO CANCELAR
    */

    botaoCancelarAula: {
        height: 42,

        marginTop: 14,

        borderRadius: 12,

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

        color: VERMELHO,
    },

    /*
    ALUNO
    */

    alunoLinha: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 11,
    },

    alunoAvatar: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: BORDA,
    },

    alunoAvatarFallback: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: AZUL_CLARO,

        alignItems: 'center',
        justifyContent: 'center',
    },

    alunoAvatarIniciais: {
        fontSize: 13,
        fontWeight: '800',

        color: AZUL,
    },

    alunoInfo: {
        flex: 1,
    },

    alunoNome: {
        fontSize: 14,
        fontWeight: '700',

        color: TEXTO_PRINCIPAL,

        marginBottom: 2,
    },

    alunoTelefoneLinha: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 5,
    },

    alunoTelefone: {
        fontSize: 12.5,

        color: TEXTO_SECUNDARIO,

        fontWeight: '500',
    },
    botaoWhatsAppAluno: {
        width: 28,
        height: 28,

        marginLeft: 6,

        borderRadius: 14,

        backgroundColor: colors.success,

        alignItems: 'center',

        justifyContent: 'center',
    },
    botaoRemarcarAula: {
        height: 42,

        marginTop: 12,

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

    possuiInstrumentoLinha: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },

    possuiInstrumentoLabel: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: TEXTO_PRINCIPAL,
        fontWeight: '600',
    },

    possuiInstrumentoBadge: {
        minWidth: 58,
        height: 26,
        paddingHorizontal: 8,
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderWidth: 1,
    },

    possuiInstrumentoSim: {
        backgroundColor: colors.successSoft,
        borderColor: colors.successBorder,
    },

    possuiInstrumentoNao: {
        backgroundColor: colors.dangerSoft,
        borderColor: colors.dangerBorder,
    },

    possuiInstrumentoTexto: {
        fontSize: 11.5,
        fontWeight: '800',
    },

    possuiInstrumentoTextoSim: {
        color: colors.success,
    },

    possuiInstrumentoTextoNao: {
        color: colors.danger,
    },
});