import { StyleSheet } from 'react-native';

const AZUL = '#093373';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    // LOADING
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F6FA',
    },

    loadingTexto: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },

    // HEADER
    header: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#F5F6FA',
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minHeight: 40,
    },

    textoVoltar: {
        marginLeft: 6,
        fontSize: 15,
        fontWeight: '600',
        color: AZUL,
    },

    // SCROLL
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 30,
    },

    // TÍTULO
    tituloContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },

    iconePerfil: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF0FB',
        borderWidth: 1,
        borderColor: '#DCE6F5',
        marginBottom: 14,
    },

    titulo: {
        fontSize: 27,
        fontWeight: '800',
        color: '#1A1E29',
        marginBottom: 7,
    },

    subtitulo: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },

    // CARD
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E7EAF0',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 2,
    },

    campoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
    },

    campoTitulo: {
        marginLeft: 9,
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1E29',
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },

    input: {
        width: '100%',
        height: 54,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#DDE2EA',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1A1E29',
    },

    inputErro: {
        borderColor: '#B42318',
    },

    // MENSAGENS
    mensagemErro: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
    },

    textoErro: {
        flex: 1,
        marginLeft: 6,
        fontSize: 12,
        lineHeight: 18,
        color: '#B42318',
    },

    mensagemSucesso: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
    },

    textoSucesso: {
        flex: 1,
        marginLeft: 6,
        fontSize: 12,
        lineHeight: 18,
        color: '#2E8B57',
        fontWeight: '600',
    },

    // INFORMAÇÃO
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
        padding: 16,
        borderRadius: 15,
        backgroundColor: '#EAF0FB',
        borderWidth: 1,
        borderColor: '#DCE6F5',
    },

    infoTexto: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 19,
        color: '#4B5563',
    },

    // FOOTER
    footer: {
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#F5F6FA',
    },

    botaoSalvar: {
        width: '100%',
        height: 54,
        borderRadius: 14,
        backgroundColor: AZUL,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,

        elevation: 2,
    },

    botaoSalvarDesabilitado: {
        opacity: 0.65,
    },

    botaoSalvarTexto: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cardEndereco: {
        marginTop: 16,
    },

    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },

    inputLoading: {
        position: 'absolute',
        right: 16,
    },

    enderecoPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 14,
        borderRadius: 13,
        backgroundColor: '#EAF0FB',
        borderWidth: 1,
        borderColor: '#DCE6F5',
    },

    enderecoPreviewConteudo: {
        flex: 1,
        marginLeft: 10,
    },

    enderecoRua: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1E29',
    },

    enderecoCidade: {
        marginTop: 3,
        fontSize: 12,
        color: '#6B7280',
    },

    linhaEndereco: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },

    campoNumero: {
        flex: 0.7,
    },

    campoComplemento: {
        flex: 1.3,
    },

    mensagemGeralErro: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        padding: 14,
        borderRadius: 13,
        backgroundColor: '#FFF1F0',
    },

    mensagemGeralSucesso: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        padding: 14,
        borderRadius: 13,
        backgroundColor: '#ECFDF3',
    },
    campoEndereco: {
        marginTop: 16,
    },
});

