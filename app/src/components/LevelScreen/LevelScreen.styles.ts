import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 4,
  },

  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 8,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 24,
  },

  pergunta: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },

  listaInstrumentos: {
    flex: 1,
  },

  instrumentoCard: {
    marginBottom: 22,
  },

  instrumentoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#093373',
  },

  opcao: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  opcaoSelecionada: {
    borderColor: '#093373',
    backgroundColor: '#F1EEFE',
  },

  opcaoTexto: {
    fontSize: 16,
    color: '#333',
  },

  opcaoTextoSelecionado: {
    color: '#093373',
    fontWeight: '700',
  },

  botaoContinuar: {
    backgroundColor: '#093373',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },

  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  seta: {
    fontSize: 26,
    color: '#093373',
    fontWeight: '700',
  },

  textoVoltar: {
    marginLeft: 6,
    fontSize: 16,
    color: '#093373',
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 8, // era 60 — dá espaço suficiente abaixo do botão voltar
    paddingBottom: 30,
  },
});