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
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    // ========================================
    // VOLTAR
    // ========================================

    botaoVoltar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: -4,
    },

    seta: {
        fontSize: 32,
        lineHeight: 32,
        color: AZUL,
        fontWeight: '400',
    },

    textoVoltar: {
        marginLeft: 3,
        fontSize: 16,
        color: AZUL,
        fontWeight: '600',
    },

    // ========================================
    // LOGO
    // ========================================

    logo: {
        width: 220,
        height: 220,
        marginTop: 28,
        marginBottom: 2,
    },

    /*
     * Quando estiver editando, o botão Voltar
     * ocupa um pequeno espaço no topo.
     * Diminuímos um pouco o espaço da logo para
     * manter a tela equilibrada.
     */
    logoEdicao: {
        marginTop: 8,
    },

    // ========================================
    // TÍTULO
    // ========================================

    titulo: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginBottom: 28,
    },

    tituloAzul: {
        color: AZUL,
    },

    tituloEdicao: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginTop: 0,
        marginBottom: 28,
    },

    // ========================================
    // PERGUNTA
    // ========================================

    pergunta: {
        width: '100%',
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
    },

    // ========================================
    // OPÇÕES
    // ========================================

    opcoesContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 20,
    },

    opcao: {
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    opcaoSelecionada: {
        borderColor: AZUL,
        backgroundColor: '#F1EEFE',
    },

    opcaoInterna: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    opcaoEsquerda: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    opcaoTexto: {
        fontSize: 16,
        color: '#333',
    },

    opcaoTextoSelecionado: {
        color: AZUL,
        fontWeight: '600',
    },

    check: {
        color: AZUL,
        fontSize: 18,
        fontWeight: 'bold',
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
        width: '100%',
        marginTop: 'auto',
        paddingBottom: 10,
        paddingTop: 12,
        backgroundColor: '#fff',
    },

    botaoContinuar: {
        width: '100%',
        backgroundColor: AZUL,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },

    botaoDesabilitado: {
        backgroundColor: '#ccc',
    },

    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});