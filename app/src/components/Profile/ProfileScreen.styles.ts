import {
    colors,
} from '../../theme/colors';

import {
    StyleSheet,
} from 'react-native';

const AZUL =
    colors.navy;

export const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor:
                colors.background,
        },

        container: {
            flex: 1,
            backgroundColor:
                colors.background,
        },

        // =========================
        // LOADING
        // =========================

        loadingContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
                colors.background,
        },

        loadingTexto: {
            marginTop: 12,
            fontSize: 14,
            color:
                colors.textSecondary,
        },

        // =========================
        // HEADER
        // =========================

        header: {
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor:
                colors.background,
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

        // =========================
        // SCROLL
        // =========================

        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 18,
            paddingBottom: 30,
        },

        // =========================
        // TÍTULO
        // =========================

        tituloContainer: {
            alignItems: 'center',
            marginBottom: 28,
        },

        iconePerfil: {
            width: 68,
            height: 68,
            borderRadius: 22,

            alignItems: 'center',
            justifyContent:
                'center',

            backgroundColor:
                colors.yellowSoft,

            borderWidth: 1,
            borderColor:
                colors.yellowBorder,

            marginBottom: 14,
        },

        titulo: {
            letterSpacing: -0.7,
            fontSize: 27,
            fontWeight: '800',
            color: colors.text,
            marginBottom: 7,
        },

        subtitulo: {
            fontSize: 14,
            color:
                colors.textSecondary,
            textAlign: 'center',
        },

        // =========================
        // CARD
        // =========================

        card: {
            backgroundColor:
                colors.surface,

            borderRadius: 22,

            padding: 20,

            borderWidth: 1,
            borderColor:
                colors.border,

            shadowColor:
                colors.navy,

            shadowOffset: {
                width: 0,
                height: 5,
            },

            shadowOpacity: 0.045,
            shadowRadius: 16,

            elevation: 2,
        },

        cardSecundario: {
            marginTop: 16,
        },

        cardEndereco: {
            marginTop: 16,
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
            color: colors.text,
        },

        // =========================
        // INPUTS
        // =========================

        label: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
        },

        input: {
            width: '100%',
            height: 54,

            borderRadius: 14,

            borderWidth: 1,
            borderColor:
                colors.border,

            backgroundColor:
                colors.background,

            paddingHorizontal: 16,

            fontSize: 16,
            color: colors.text,
        },

        inputErro: {
            borderColor:
                colors.danger,
        },

        inputWrapper: {
            position: 'relative',
            justifyContent:
                'center',
        },

        inputLoading: {
            position: 'absolute',
            right: 16,
        },

        // =========================
        // FAIXA ETÁRIA
        // =========================

        faixaEtariaContainer: {
            width: '100%',
            marginTop: 20,
        },

        faixasContainer: {
            width: '100%',

            flexDirection: 'row',
            flexWrap: 'wrap',

            gap: 8,
        },

        faixaBotao: {
            minHeight: 42,

            paddingHorizontal: 14,
            paddingVertical: 9,

            borderRadius: 12,

            borderWidth: 1,
            borderColor:
                colors.border,

            backgroundColor:
                colors.background,

            alignItems: 'center',
            justifyContent:
                'center',
        },

        faixaBotaoSelecionado: {
            backgroundColor:
                colors.navy,

            borderColor:
                colors.navy,

            shadowColor:
                colors.navy,

            shadowOffset: {
                width: 0,
                height: 2,
            },

            shadowOpacity: 0.12,
            shadowRadius: 5,

            elevation: 2,
        },

        faixaTexto: {
            fontSize: 13,
            fontWeight: '600',
            color:
                colors.textSecondary,
        },

        faixaTextoSelecionado: {
            color:
                colors.surface,

            fontWeight: '700',
        },

        // =========================
        // MENSAGENS
        // =========================

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

            color:
                colors.danger,
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

            color:
                colors.success,

            fontWeight: '600',
        },

        mensagemGeralErro: {
            flexDirection: 'row',
            alignItems: 'center',

            gap: 8,

            marginTop: 14,

            padding: 14,

            borderRadius: 13,

            backgroundColor:
                colors.dangerSoft,
        },

        mensagemGeralSucesso: {
            flexDirection: 'row',
            alignItems: 'center',

            gap: 8,

            marginTop: 14,

            padding: 14,

            borderRadius: 13,

            backgroundColor:
                colors.successSoft,
        },

        // =========================
        // ENDEREÇO
        // =========================

        campoEndereco: {
            marginTop: 16,
        },

        enderecoPreview: {
            flexDirection: 'row',
            alignItems: 'center',

            marginTop: 12,

            padding: 14,

            borderRadius: 13,

            backgroundColor:
                colors.tealSoft,

            borderWidth: 1,

            borderColor:
                colors.tealBorder,
        },

        enderecoPreviewConteudo: {
            flex: 1,
            marginLeft: 10,
        },

        enderecoRua: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.text,
        },

        enderecoCidade: {
            marginTop: 3,

            fontSize: 12,

            color:
                colors.textSecondary,
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

        // =========================
        // INFORMAÇÃO
        // =========================

        infoCard: {
            flexDirection: 'row',
            alignItems:
                'flex-start',

            marginTop: 16,

            padding: 16,

            borderRadius: 15,

            backgroundColor:
                colors.tealSoft,

            borderWidth: 1,

            borderColor:
                colors.tealBorder,
        },

        infoTexto: {
            flex: 1,

            marginLeft: 10,

            fontSize: 13,
            lineHeight: 19,

            color:
                colors.textSecondary,
        },

        // =========================
        // FOOTER
        // =========================

        footer: {
            width: '100%',

            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 16,

            backgroundColor:
                colors.surface,
        },

        botaoSalvar: {
            width: '100%',
            height: 54,

            borderRadius: 16,

            backgroundColor:
                colors.navy,

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
                'center',

            gap: 9,

            shadowColor:
                colors.navy,

            shadowOffset: {
                width: 0,
                height: 4,
            },

            shadowOpacity: 0.14,
            shadowRadius: 10,

            elevation: 3,
        },

        botaoSalvarDesabilitado: {
            opacity: 0.65,
        },

        botaoSalvarTexto: {
            fontSize: 16,
            fontWeight: '700',
            color:
                colors.surface,
        },
    });