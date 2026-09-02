
import { StyleSheet } from 'react-native';

const AZUL = '#093373';

export const styles = StyleSheet.create({
    // ========================================
    // CONTAINER
    // ========================================

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 30,
    },

    // ========================================
    // LOADING
    // ========================================

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    loadingTexto: {
        marginTop: 12,
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
    },

    // ========================================
    // HEADER
    // ========================================

    header: {
        width: '100%',
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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

    // ========================================
    // TÍTULO
    // ========================================

    titulo: {
        width: '100%',
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginTop: 20,
        marginBottom: 10,
    },

    subtitulo: {
        width: '100%',
        fontSize: 14,
        lineHeight: 21,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },

    // ========================================
    // LISTA DE INSTRUMENTOS
    // ========================================

    listaInstrumentos: {
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },

    // ========================================
    // OPÇÃO
    // ========================================

    opcao: {
        width: '100%',
        minHeight: 76,
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    opcaoSelecionada: {
        borderColor: AZUL,
        backgroundColor: '#F1EEFE',
    },

    // ========================================
    // ÍCONE
    // ========================================

    iconeContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F4F8',
        marginRight: 14,
    },

    iconeContainerSelecionado: {
        backgroundColor: AZUL,
    },

    // ========================================
    // NOME
    // ========================================

    nomeInstrumento: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },

    nomeInstrumentoSelecionado: {
        color: AZUL,
        fontWeight: '700',
    },

    // ========================================
    // CHECK
    // ========================================

    checkContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AZUL,
        marginLeft: 10,
    },

    // ========================================
    // BOTÃO CONTINUAR
    // ========================================

    botaoContinuar: {
        width: '100%',
        minHeight: 54,
        borderRadius: 12,
        backgroundColor: AZUL,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
    },

    botaoContinuarDesabilitado: {
        backgroundColor: '#ccc',
    },

    textoBotaoContinuar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

