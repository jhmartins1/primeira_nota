import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },

    botaoVoltar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },

    headerTexto: {
        flex: 1,
    },

    titulo: {
        letterSpacing: -0.6,
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
    },

    subtitulo: {
        marginTop: 3,
        fontSize: 14,
        color: colors.textSecondary,
    },

    lista: {
        gap: 14,
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.textSecondary,
    },

    estadoContainer: {
        shadowColor: colors.navy,
        shadowOpacity: 0.045,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 8,
    },

    estadoTitulo: {
        marginTop: 14,
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },

    estadoTexto: {
        marginTop: 7,
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    botaoTentarNovamente: {
        marginTop: 18,
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: colors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoTentarNovamenteTexto: {
        color: colors.surface,
        fontSize: 14,
        fontWeight: '700',
    },

    botaoAgendar: {
        shadowColor: colors.navy,
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        marginTop: 18,
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: colors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoAgendarTexto: {
        color: colors.surface,
        fontSize: 14,
        fontWeight: '700',
    },
});