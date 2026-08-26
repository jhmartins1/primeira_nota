import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 4,
  },

  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  seta: {
    fontSize: 32,
    lineHeight: 32,
    color: '#093373',
    fontWeight: '400',
  },

  textoVoltar: {
    marginLeft: 4,
    fontSize: 16,
    color: '#093373',
    fontWeight: '600',
  },

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    lineHeight: 21,
    color: '#666',
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 5,
  },

  listaInstrumentos: {
    width: '100%',
  },

  instrumentoCard: {
    marginBottom: 24,
  },

  instrumentoTitulo: {
    fontSize: 19,
    fontWeight: '700',
    color: '#093373',
    marginBottom: 12,
  },

  niveisContainer: {
    gap: 10,
  },

  opcao: {
    borderWidth: 1.5,
    borderColor: '#E1E1E1',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },

  opcaoSelecionada: {
    borderColor: '#093373',
    backgroundColor: '#F1EEFE',
  },

  opcaoConteudo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  opcaoTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },

  opcaoTextoSelecionado: {
    color: '#093373',
  },

  estrelas: {
    fontSize: 15,
    letterSpacing: 2,
    color: '#D4A72C',
  },

  estrelasSelecionadas: {
    color: '#093373',
  },

  check: {
    fontSize: 20,
    fontWeight: '700',
    color: '#093373',
    marginLeft: 10,
  },

  footer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  botaoContinuar: {
    width: '100%',
    backgroundColor: '#093373',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  botaoDesabilitado: {
    backgroundColor: '#CCC',
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});