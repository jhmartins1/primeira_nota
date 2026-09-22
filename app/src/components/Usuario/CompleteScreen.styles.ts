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
const VERMELHO = colors.danger;
const VERMELHO_FUNDO = colors.dangerSoft;

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },

    // =========================
    // HEADER
    // =========================

    header: {
        paddingHorizontal: 22,
        paddingTop: 8,
        paddingBottom: 4,
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minHeight: 40,
        gap: 4,
    },

    textoVoltar: {
        fontSize: 15,
        color: AZUL,
        fontWeight: '600',
    },

    // =========================
    // CONTEÚDO
    // =========================

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    conteudo: {
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 28,
        paddingBottom: 12,
    },

    titulo: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        color: TEXTO_PRINCIPAL,
        lineHeight: 30,
        marginBottom: 8,
    },

    tituloAzul: {
        color: colors.teal,
    },

    subtitulo: {
        width: '88%',
        fontSize: 14,
        lineHeight: 21,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
        marginBottom: 24,
    },

    // =========================
    // CARDS DE SEÇÃO
    // =========================

    card: {
        width: '100%',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: BORDA,
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,

        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.045,
        shadowRadius: 16,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    cardIcone: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.yellowSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    cardTituloContainer: {
        flex: 1,
    },

    cardTitulo: {
        fontSize: 15,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },

    cardSubtitulo: {
        fontSize: 12,
        color: TEXTO_SECUNDARIO,
        marginTop: 1,
    },

    // =========================
    // INPUT
    // =========================

    inputContainer: {
        width: '100%',
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },

    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },

    inputIcone: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },

    input: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDA,
        backgroundColor: colors.surfaceMuted,
        paddingHorizontal: 16,
        paddingLeft: 44,
        fontSize: 15,
        fontWeight: '600',
        color: TEXTO_PRINCIPAL,
    },

    inputErro: {
        borderColor: VERMELHO,
        backgroundColor: VERMELHO_FUNDO,
    },

    inputLoading: {
        position: 'absolute',
        right: 16,
    },

    textoErroCampo: {
        marginTop: 6,
        fontSize: 12,
        color: VERMELHO,
    },

    // =========================
    // PREVIEW DE ENDEREÇO
    // =========================

    enderecoPreview: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: DOURADO_FUNDO,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginTop: 12,
        gap: 8,
    },

    enderecoPreviewTexto: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: colors.amberText,
        fontWeight: '600',
    },

    linhaDupla: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginTop: 14,
    },

    inputMetade: {
        flex: 1,
    },

    labelOpcional: {
        fontWeight: '400',
        color: colors.textMuted,
    },

    // =========================
    // ERRO GERAL
    // =========================

    bannerErro: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: VERMELHO_FUNDO,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 4,
    },

    bannerErroTexto: {
        flex: 1,
        fontSize: 13,
        color: VERMELHO,
        fontWeight: '600',
    },

    // =========================
    // FOOTER
    // =========================

    footer: {
        width: '100%',
        paddingHorizontal: 22,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: colors.surface,
    },

    botaoContinuar: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.navy,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,

        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 3,
    },

    botaoDesabilitado: {
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },

    botaoContinuarTexto: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.surface,
    },
});