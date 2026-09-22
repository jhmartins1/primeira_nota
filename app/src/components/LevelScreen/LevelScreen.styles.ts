import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

const AZUL = colors.navy;
const AZUL_CLARO = colors.tealSoft;
const FUNDO = colors.background;
const BORDA = colors.border;

const TEXTO = colors.text;
const SECUNDARIO = colors.textSecondary;

const DOURADO = colors.amberText;
const DOURADO_CLARO = colors.yellowSoft;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },


  //HEADER
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

  //SCROLL
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
  },

  //TÍTULO
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

  //PROGRESSO
  progressoContainer: {
    marginBottom: 24,
  },

  progressoTopo: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

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

    backgroundColor:
      colors.border,

    borderRadius: 10,

    overflow: 'hidden',
  },

  progressoPreenchido: {
    height: '100%',

    backgroundColor: colors.turquoise,

    borderRadius: 10,
  },

  //LISTA DE INSTRUMENTOS
  listaInstrumentos: {
    gap: 18,
  },



  //CARD DO INSTRUMENTO
  instrumentoCard: {
    backgroundColor:
      colors.surface,

    borderRadius: 22,

    borderWidth: 1,

    borderColor: BORDA,

    padding: 18,

    shadowColor:
      colors.navy,

    shadowOffset: { width: 0, height: 5 },

    shadowOpacity: 0.045,

    shadowRadius: 16,

    elevation: 2,
  },

  instrumentoHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,
  },

  instrumentoIcone: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor:
      colors.yellowSoft,

    alignItems: 'center',

    justifyContent:
      'center',

    marginRight: 12,
  },

  instrumentoHeaderInfo: {
    flex: 1,
  },

  instrumentoLabel: {
    fontSize: 11,

    fontWeight: '700',

    color: SECUNDARIO,

    textTransform:
      'uppercase',

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

  //NÍVEIS
  niveisContainer: {
    gap: 9,
  },

  opcao: {
    borderWidth: 1.5,

    borderColor: BORDA,

    borderRadius: 15,

    backgroundColor:
      colors.surface,

    paddingHorizontal: 14,

    paddingVertical: 13,
  },

  opcaoSelecionada: {
    borderColor: colors.teal,

    backgroundColor:
      colors.tealSoft,
  },

  opcaoConteudo: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  estrelaContainer: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor:
      DOURADO_CLARO,

    alignItems: 'center',

    justifyContent:
      'center',

    marginRight: 12,
  },

  estrelaContainerSelecionada: {
    backgroundColor:
      colors.surface,
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

    backgroundColor:
      colors.teal,

    color: colors.surface,

    textAlign: 'center',

    textAlignVertical:
      'center',

    fontSize: 14,

    fontWeight: '800',

    overflow: 'hidden',
  },

  //TELA VAZIA
  vazioContainer: {
    flex: 1,

    justifyContent:
      'center',

    alignItems: 'center',

    paddingHorizontal: 28,
  },

  vazioTitulo: {
    marginTop: 16,

    fontSize: 19,

    fontWeight: '800',

    color: TEXTO,

    textAlign: 'center',
  },

  vazioTexto: {
    marginTop: 8,

    fontSize: 14,

    lineHeight: 21,

    color: SECUNDARIO,

    textAlign: 'center',
  },

  botaoSelecionarInstrumentos: {
    marginTop: 22,

    backgroundColor: AZUL,

    paddingHorizontal: 20,

    paddingVertical: 13,

    borderRadius: 13,
  },

  botaoSelecionarInstrumentosTexto: {
    fontSize: 14,

    fontWeight: '700',

    color: colors.surface,
  },
  //FOOTER
  footer: {
    paddingHorizontal: 22,

    paddingTop: 10,

    paddingBottom: 12,

    backgroundColor:
      colors.surface,

    borderTopWidth: 1,

    borderTopColor:
      colors.border,
  },

  botaoContinuar: {
    height: 54,

    borderRadius: 16,

    backgroundColor: colors.navy,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'center',

    shadowColor: colors.navy,

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.14,

    shadowRadius: 10,

    elevation: 3,
  },

  botaoDesabilitado: {
    backgroundColor:
      colors.disabled,

    shadowOpacity: 0,

    elevation: 0,
  },

  botaoTexto: {
    color: colors.surface,

    fontSize: 15,

    fontWeight: '800',
  },

  botaoSeta: {
    color: colors.surface,

    fontSize: 20,

    marginLeft: 8,

    marginTop: -1,
  },
});