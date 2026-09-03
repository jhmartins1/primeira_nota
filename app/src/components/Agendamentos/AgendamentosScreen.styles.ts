import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    headerTexto: {
        flex: 1,
    },

    titulo: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
    },

    subtitulo: {
        marginTop: 3,
        fontSize: 14,
        color: '#6B7280',
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
        color: '#6B7280',
    },

    estadoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 8,
    },

    estadoTitulo: {
        marginTop: 14,
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },

    estadoTexto: {
        marginTop: 7,
        fontSize: 14,
        lineHeight: 20,
        color: '#6B7280',
        textAlign: 'center',
    },

    botaoTentarNovamente: {
        marginTop: 18,
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#093373',
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoTentarNovamenteTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    botaoAgendar: {
        marginTop: 18,
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#093373',
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoAgendarTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});