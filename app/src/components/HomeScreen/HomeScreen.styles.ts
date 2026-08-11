import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BORDA = '#E7EAF0';
const TEXTO_PRINCIPAL = '#1A1E29';
const TEXTO_SECUNDARIO = '#6B7280';
const DOURADO = '#B8842E';
const DOURADO_FUNDO = '#FBF1DE';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FUNDO,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 8,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: AZUL,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    titulo: {
        fontSize: 26,
        fontWeight: '800',
        color: TEXTO_PRINCIPAL,
    },
    subtitulo: {
        fontSize: 14,
        color: TEXTO_SECUNDARIO,
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
        gap: 14,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDA,
        padding: 16,
        shadowColor: '#0F1B3D',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 14,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    instrumentoNome: {
        fontSize: 17,
        fontWeight: '700',
        color: TEXTO_PRINCIPAL,
        marginBottom: 8,
    },
    nivelBadge: {
        alignSelf: 'flex-start',
        backgroundColor: DOURADO_FUNDO,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    nivelBadgeTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: DOURADO,
    },
    botaoEditar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: AZUL_CLARO,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoEditarTexto: {
        fontSize: 16,
    },
    niveisContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: BORDA,
    },
    opcaoNivel: {
        borderWidth: 1,
        borderColor: AZUL_CLARO,
        backgroundColor: AZUL_CLARO,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    opcaoNivelSelecionada: {
        backgroundColor: AZUL,
        borderColor: AZUL,
    },
    opcaoNivelTexto: {
        fontSize: 13,
        color: AZUL,
        fontWeight: '600',
    },
    opcaoNivelTextoSelecionado: {
        color: '#FFFFFF',
    },
    botaoAgendarCard: {
        marginTop: 14,
        backgroundColor: AZUL,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    botaoAgendarCardTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    botaoTrocar: {
        alignSelf: 'center',
        marginTop: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    botaoTrocarTexto: {
        color: AZUL,
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    vazioContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 24,
    },
    vazioTexto: {
        fontSize: 15,
        color: TEXTO_SECUNDARIO,
        textAlign: 'center',
    },
});