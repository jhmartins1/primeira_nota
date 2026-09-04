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

    // =========================
    // HEADER
    // =========================

    header: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 0,
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minHeight: 40,
    },

    seta: {
        fontSize: 32,
        lineHeight: 32,
        color: AZUL,
        fontWeight: '400',
    },

    textoVoltar: {
        marginLeft: 4,
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
        paddingHorizontal: 24,
        paddingTop: 20,
    },

    logo: {
        width: 180,
        height: 180,
        marginBottom: 8,
    },

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

    subtitulo: {
        width: '90%',
        fontSize: 14,
        lineHeight: 21,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
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
        color: '#333',
        marginBottom: 8,
    },

    input: {
        width: '100%',
        height: 54,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#222',
    },

    inputErro: {
        borderColor: '#e63946',
    },

    textoErro: {
        marginTop: 6,
        fontSize: 12,
        color: '#e63946',
    },

    // =========================
    // FOOTER
    // =========================

    footer: {
        width: '100%',
        paddingHorizontal: 24,
        paddingBottom: 16,
        paddingTop: 12,
        backgroundColor: '#fff',
    },

    botaoContinuar: {
        width: '100%',
        height: 54,
        borderRadius: 12,
        backgroundColor: AZUL,

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

    botaoContinuarTexto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
