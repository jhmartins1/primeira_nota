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
    container: { flex: 1, backgroundColor: FUNDO },

    header: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    botaoVoltar: {
        marginBottom: 14,
    },
    botaoVoltarTexto: {
        fontSize: 15,
        fontWeight: '500',
        color: AZUL,
    },
    headerTextos: {
        width: '100%',
    },

    eyebrow: { fontSize: 13, color: TEXTO_SECUNDARIO, textTransform: 'uppercase' },
    titulo: { fontSize: 24, fontWeight: '700', marginTop: 2, color: TEXTO_PRINCIPAL },
    subtitulo: { fontSize: 14, color: TEXTO_SECUNDARIO, marginTop: 2 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    secaoTitulo: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10, color: TEXTO_PRINCIPAL },
    vazioTexto: { fontSize: 14, color: TEXTO_SECUNDARIO },

    professoresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    professorCard: {
        width: 90,
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDA,
        backgroundColor: '#fff',
    },
    professorCardSelecionado: { borderColor: AZUL, backgroundColor: AZUL_CLARO },
    professorFoto: { width: 56, height: 56, borderRadius: 28, marginBottom: 6 },
    professorNome: { fontSize: 12, textAlign: 'center', fontWeight: '500', color: TEXTO_PRINCIPAL },

    diasContainer: { gap: 10, paddingBottom: 4 },
    diaCard: {
        width: 56,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDA,
        backgroundColor: '#fff',
    },
    diaCardSelecionado: { borderColor: AZUL, backgroundColor: AZUL_CLARO },
    diaCardDesabilitado: { opacity: 0.35 },
    diaSemanaTexto: { fontSize: 12, color: TEXTO_SECUNDARIO },
    diaMesTexto: { fontSize: 16, fontWeight: '700', marginTop: 2, color: TEXTO_PRINCIPAL },
    diaTextoSelecionado: { color: AZUL },

    horariosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    horarioCard: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDA,
        backgroundColor: '#fff',
    },
    horarioCardSelecionado: { borderColor: AZUL, backgroundColor: AZUL },
    horarioTexto: { fontSize: 14, fontWeight: '500', color: TEXTO_PRINCIPAL },
    horarioTextoSelecionado: { color: '#fff' },

    resumoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: DOURADO_FUNDO,
    },
    resumoFoto: { width: 48, height: 48, borderRadius: 24 },
    resumoTextos: { flex: 1 },
    resumoInstrumento: { fontSize: 13, color: DOURADO, fontWeight: '600' },
    resumoProfessor: { fontSize: 15, fontWeight: '700', marginTop: 2, color: TEXTO_PRINCIPAL },
    resumoData: { fontSize: 13, color: TEXTO_SECUNDARIO, marginTop: 2 },

    botaoConfirmar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: AZUL,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    botaoConfirmarTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
});