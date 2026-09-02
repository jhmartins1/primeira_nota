import { StyleSheet } from 'react-native';

const AZUL = '#093373';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // ========================================
    // CONTEÚDO
    // ========================================

    conteudo: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 50,
    },

    // ========================================
    // LOGO
    // ========================================

    logo: {
        width: 220,
        height: 220,
        marginBottom: 8,
    },

    // ========================================
    // TÍTULO
    // ========================================

    titulo: {
        fontSize: 21,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        lineHeight: 29,
        marginBottom: 14,
    },

    tituloAzul: {
        color: AZUL,
    },

    // ========================================
    // SUBTÍTULO
    // ========================================

    subtitulo: {
        width: '90%',
        fontSize: 14,
        lineHeight: 21,
        color: '#666',
        textAlign: 'center',
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
        width: '100%',
        paddingHorizontal: 24,
        paddingBottom: 16,
        paddingTop: 12,
        backgroundColor: '#fff',
    },

    // ========================================
    // BOTÃO GOOGLE
    // ========================================

    botaoGoogle: {
        width: '100%',
        height: 54,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        elevation: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },

    botaoDesabilitado: {
        opacity: 0.6,
    },

    googleIconContainer: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    googleIcon: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4285F4',
    },

    botaoGoogleTexto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    // ========================================
    // TERMOS
    // ========================================

    termos: {
        marginTop: 14,
        paddingHorizontal: 10,

        fontSize: 11,
        lineHeight: 16,
        color: '#999',

        textAlign: 'center',
    },
});
