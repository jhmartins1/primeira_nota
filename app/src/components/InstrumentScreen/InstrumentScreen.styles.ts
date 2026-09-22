import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

const AZUL = colors.navy;

export const styles = StyleSheet.create({
    // CONTAINER

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 30,
    },

    // LOADING
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    loadingTexto: {
        marginTop: 12,
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    // HEADER
    header: {
        width: '100%',
        height: 52,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 20,

        backgroundColor: colors.background,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    botaoVoltar: {
        width: 40,
        height: 40,

        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitulo: {
        flex: 1,

        fontSize: 18,
        fontWeight: '700',

        color: AZUL,

        textAlign: 'center',

        marginRight: 40,
    },

    // TÍTULO
    titulo: {
        letterSpacing: -0.6,
        width: '100%',

        fontSize: 26,
        fontWeight: '800',

        textAlign: 'center',

        color: colors.text,

        marginTop: 28,
        marginBottom: 10,
    },

    subtitulo: {
        width: '100%',

        fontSize: 14,
        lineHeight: 21,

        color: colors.textSecondary,

        textAlign: 'center',

        marginBottom: 24,
    },

    // LISTA
    listaInstrumentos: {
        width: '100%',

        gap: 12,

        marginBottom: 24,
    },

    // WRAPPER
    opcaoWrapper: {
        width: '100%',

        borderWidth: 1.5,
        borderColor: colors.border,

        borderRadius: 20,

        backgroundColor: colors.surface,

        overflow: 'hidden',
    },

    opcaoWrapperSelecionado: {
        borderColor: colors.teal,

        backgroundColor: colors.tealSoft,
    },

    // OPÇÃO PRINCIPAL
    opcao: {
        width: '100%',

        minHeight: 76,

        paddingHorizontal: 18,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: colors.surface,
    },

    opcaoSelecionada: {
        backgroundColor: colors.tealSoft,
    },

    // ÍCONE
    iconeContainer: {
        width: 48,
        height: 48,

        borderRadius: 16,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.yellowSoft,

        marginRight: 14,
    },

    iconeContainerSelecionado: {
        backgroundColor: colors.teal,
    },

    // NOME
    nomeInstrumento: {
        flex: 1,

        fontSize: 16,
        fontWeight: '500',

        color: colors.text,
    },

    nomeInstrumentoSelecionado: {
        color: AZUL,
        fontWeight: '700',
    },

    // CHECK SELEÇÃO DO INSTRUMENTO
    checkContainer: {
        width: 28,
        height: 28,

        borderRadius: 14,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.teal,

        marginLeft: 10,
    },

    // POSSUI INSTRUMENTO
    possuiInstrumentoContainer: {
        minHeight: 64,

        paddingHorizontal: 18,
        paddingVertical: 13,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: colors.surface,

        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    checkboxPossui: {
        width: 24,
        height: 24,

        borderRadius: 6,

        borderWidth: 1.5,
        borderColor: colors.disabled,

        backgroundColor: colors.surface,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    checkboxPossuiSelecionado: {
        backgroundColor: colors.teal,
        borderColor: colors.teal,
    },

    possuiInstrumentoTextos: {
        flex: 1,
    },

    possuiInstrumentoTitulo: {
        fontSize: 14,
        fontWeight: '700',

        color: colors.text,

        marginBottom: 3,
    },

    possuiInstrumentoDescricao: {
        fontSize: 12,
        lineHeight: 17,

        color: colors.textSecondary,
    },

    botaoContinuar: {
        shadowColor: colors.navy,
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        width: '100%',
        minHeight: 54,

        borderRadius: 16,

        backgroundColor: colors.navy,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,

        marginTop: 4,
    },

    botaoContinuarDesabilitado: {
        backgroundColor: colors.disabled,
    },

    textoBotaoContinuar: {
        color: colors.surface,

        fontSize: 16,
        fontWeight: '700',
    },
});