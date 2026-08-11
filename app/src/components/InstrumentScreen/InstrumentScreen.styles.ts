import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 80,
    },

    logo: {
        width: 220,
        height: 220,
        marginBottom: 2,
    },

    titulo: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginBottom: 28,
    },

    pergunta: {
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
    },

    opcoesContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },

    opcao: {
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
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
        fontWeight: '600',
    },

    botaoContinuar: {
        width: '100%',
        backgroundColor: '#093373',
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