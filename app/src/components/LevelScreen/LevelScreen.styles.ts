import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_CLARO = '#EAF0FB';
const FUNDO = '#F5F6FA';
const BORDA = '#E3E7EF';

const TEXTO = '#1A1E29';
const SECUNDARIO = '#6B7280';

const DOURADO = '#B8842E';
const DOURADO_CLARO = '#FBF1DE';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 6,
  },

  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 12,
  },

  seta: {
    fontSize: 30,
    lineHeight: 30,
    color: AZUL,
    fontWeight: '300',
  },

  textoVoltar: {
    marginLeft: 4,
    fontSize: 15,
    color: AZUL,
    fontWeight: '700',
  },

  // ========================================
  // SCROLL
  // ========================================

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
  },

  // ========================================
  // TÍTULO
  // ========================================

  tituloContainer: {
    marginBottom: 22,
  },

  titulo: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '800',
    color: TEXTO,
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: SECUNDARIO,
  },

  // ========================================
  // PROGRESSO
  // ========================================

  progressoContainer: {
    marginBottom: 24,
  },

  progressoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: SECUNDARIO,
  },

  progressoNumero: {
    fontSize: 12,
    fontWeight: '800',
    color: AZUL,
  },

  progressoFundo: {
    height: 6,
    backgroundColor: '#E2E6ED',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressoPreenchido: {
    height: '100%',
    backgroundColor: AZUL,
    borderRadius: 10,
  },

  // ========================================
  // INSTRUMENTO
  // ========================================

  listaInstrumentos: {
    gap: 18,
  },

  instrumentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDA,
    padding: 18,

    shadowColor: '#0F1B3D',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  instrumentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  instrumentoIcone: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: AZUL_CLARO,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  instrumentoHeaderInfo: {
    flex: 1,
  },

  instrumentoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SECUNDARIO,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },

  instrumentoTitulo: {
    fontSize: 19,
    fontWeight: '800',
    color: TEXTO,
  },

  perguntaNivel: {
    fontSize: 12,
    color: SECUNDARIO,
    marginTop: 2,
  },

  // ========================================
  // NÍVEIS
  // ========================================

  niveisContainer: {
    gap: 9,
  },

  opcao: {
    borderWidth: 1.5,
    borderColor: BORDA,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  opcaoSelecionada: {
    borderColor: AZUL,
    backgroundColor: AZUL_CLARO,
  },

  opcaoConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  estrelaContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: DOURADO_CLARO,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  estrelaContainerSelecionada: {
    backgroundColor: '#FFFFFF',
  },

  estrelas: {
    fontSize: 16,
    letterSpacing: 1,
    color: DOURADO,
    fontWeight: '800',
  },

  estrelasSelecionadas: {
    color: AZUL,
  },

  opcaoInfo: {
    flex: 1,
  },

  opcaoTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXTO,
    marginBottom: 3,
  },

  opcaoTextoSelecionado: {
    color: AZUL,
  },

  opcaoDescricao: {
    fontSize: 12,
    lineHeight: 17,
    color: SECUNDARIO,
  },

  check: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: AZUL,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '800',
    overflow: 'hidden',
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: FUNDO,
    borderTopWidth: 1,
    borderTopColor: '#E7EAF0',
  },

  botaoContinuar: {
    height: 54,
    borderRadius: 15,
    backgroundColor: AZUL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: AZUL,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },

  botaoDesabilitado: {
    backgroundColor: '#C7CBD3',
    shadowOpacity: 0,
    elevation: 0,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  botaoSeta: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 8,
    marginTop: -1,
  },
});