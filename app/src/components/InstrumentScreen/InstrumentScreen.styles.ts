import { StyleSheet } from 'react-native';

const AZUL = '#093373';

export const styles = StyleSheet.create({
    // CONTAINER

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
        color: '#555',
        textAlign: 'center',
    },

    // HEADER
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

    // TÍTULO
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
        borderColor: '#DDDDDD',

        borderRadius: 14,

        backgroundColor: '#FFFFFF',

        overflow: 'hidden',
    },

    opcaoWrapperSelecionado: {
        borderColor: AZUL,

        backgroundColor: '#F8FAFD',
    },

    // OPÇÃO PRINCIPAL
    opcao: {
        width: '100%',

        minHeight: 76,

        paddingHorizontal: 18,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',
    },

    opcaoSelecionada: {
        backgroundColor: '#F1EEFE',
    },

    // ÍCONE
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

    // NOME
    nomeInstrumento: {
        flex: 1,

        fontSize: 16,
        fontWeight: '500',

        color: '#333333',
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

        backgroundColor: AZUL,

        marginLeft: 10,
    },

    // POSSUI INSTRUMENTO
    possuiInstrumentoContainer: {
        minHeight: 64,

        paddingHorizontal: 18,
        paddingVertical: 13,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#F8FAFD',

        borderTopWidth: 1,
        borderTopColor: '#E3E7EF',
    },

    checkboxPossui: {
        width: 24,
        height: 24,

        borderRadius: 6,

        borderWidth: 1.5,
        borderColor: '#AAB3C2',

        backgroundColor: '#FFFFFF',

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    checkboxPossuiSelecionado: {
        backgroundColor: AZUL,
        borderColor: AZUL,
    },

    possuiInstrumentoTextos: {
        flex: 1,
    },

    possuiInstrumentoTitulo: {
        fontSize: 14,
        fontWeight: '700',

        color: '#1A1E29',

        marginBottom: 3,
    },

    possuiInstrumentoDescricao: {
        fontSize: 12,
        lineHeight: 17,

        color: '#6B7280',
    },

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
        backgroundColor: '#CCCCCC',
    },

    textoBotaoContinuar: {
        color: '#FFFFFF',

        fontSize: 16,
        fontWeight: '700',
    },
});