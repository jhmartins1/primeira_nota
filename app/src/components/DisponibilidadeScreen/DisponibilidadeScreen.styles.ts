import {
    StyleSheet,
} from 'react-native';

const AZUL =
    '#093373';

const AZUL_CLARO =
    '#EAF0FB';

const FUNDO =
    '#F5F6FA';

const BORDA =
    '#E7EAF0';

const TEXTO_PRINCIPAL =
    '#1A1E29';

const TEXTO_SECUNDARIO =
    '#6B7280';

const VERMELHO_FUNDO =
    '#FFF1F0';

export const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                FUNDO,
        },

        scrollContent: {
            paddingHorizontal:
                22,
            paddingTop: 18,
            paddingBottom:
                120,
        },

        header: {
            paddingTop: 8,
            paddingBottom: 20,
        },

        eyebrow: {
            fontSize: 12,
            fontWeight: '700',
            color: AZUL,
            letterSpacing: 1.4,
            textTransform:
                'uppercase',
            marginBottom: 5,
        },

        titulo: {
            fontSize: 26,
            fontWeight: '800',
            color:
                TEXTO_PRINCIPAL,
        },

        subtitulo: {
            fontSize: 14,
            color:
                TEXTO_SECUNDARIO,
            marginTop: 5,
            lineHeight: 20,
        },

        vazioCard: {
            backgroundColor:
                '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: BORDA,
            padding: 24,
            alignItems:
                'center',
            marginTop: 8,
        },

        vazioIcone: {
            width: 66,
            height: 66,
            borderRadius: 33,
            backgroundColor:
                AZUL_CLARO,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginBottom: 14,
        },

        vazioTitulo: {
            fontSize: 17,
            fontWeight: '800',
            color:
                TEXTO_PRINCIPAL,
            marginBottom: 7,
            textAlign:
                'center',
        },

        vazioTexto: {
            fontSize: 14,
            lineHeight: 21,
            color:
                TEXTO_SECUNDARIO,
            textAlign:
                'center',
        },

        grupo: {
            marginBottom: 22,
        },

        grupoTitulo: {
            fontSize: 14,
            fontWeight: '800',
            color: AZUL,
            marginBottom: 10,
            textTransform:
                'capitalize',
        },

        horarioCard: {
            backgroundColor:
                '#FFFFFF',
            borderWidth: 1,
            borderColor: BORDA,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal:
                14,
            flexDirection: 'row',
            alignItems:
                'center',
            marginBottom: 8,
        },

        horarioIcone: {
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor:
                AZUL_CLARO,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginRight: 12,
        },

        horarioTexto: {
            fontSize: 14,
            fontWeight: '700',
            color:
                TEXTO_PRINCIPAL,
        },

        botaoRemover: {
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems:
                'center',
            justifyContent:
                'center',
            backgroundColor:
                VERMELHO_FUNDO,
        },

        botaoAdicionar: {
            position:
                'absolute',
            right: 22,
            bottom: 28,
            height: 52,
            paddingHorizontal:
                20,
            borderRadius: 26,
            backgroundColor:
                AZUL,
            flexDirection: 'row',
            alignItems:
                'center',
            gap: 8,

            shadowColor:
                '#0F1B3D',
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 5,
        },

        botaoAdicionarTexto:
        {
            color:
                '#FFFFFF',
            fontWeight:
                '800',
            fontSize: 14,
        },

        modalFundo: {
            flex: 1,
            backgroundColor:
                'rgba(15, 27, 61, 0.45)',
            justifyContent:
                'flex-end',
        },

        modalConteudo: {
            backgroundColor:
                '#FFFFFF',
            borderTopLeftRadius:
                24,
            borderTopRightRadius:
                24,
            paddingHorizontal:
                22,
            paddingTop: 20,
            paddingBottom: 34,
            maxHeight: '92%',
        },

        modalHandle: {
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor:
                BORDA,
            alignSelf:
                'center',
            marginBottom: 16,
        },

        modalTitulo: {
            fontSize: 19,
            fontWeight: '800',
            color:
                TEXTO_PRINCIPAL,
            marginBottom: 18,
        },

        campoLabel: {
            fontSize: 13,
            fontWeight: '700',
            color:
                TEXTO_SECUNDARIO,
            marginBottom: 8,
            marginTop: 14,
        },

        campoValor: {
            borderWidth: 1,
            borderColor: BORDA,
            borderRadius: 12,
            paddingVertical: 13,
            paddingHorizontal:
                14,
            flexDirection: 'row',
            alignItems:
                'center',
            gap: 9,
            backgroundColor:
                FUNDO,
        },

        campoValorTexto: {
            fontSize: 14,
            fontWeight: '600',
            color:
                TEXTO_PRINCIPAL,
        },

        horariosCabecalho: {
            flexDirection: 'row',
            alignItems:
                'center',
            justifyContent:
                'space-between',
            marginTop: 14,
            marginBottom: 8,
        },

        marcarTodosTexto: {
            fontSize: 13,
            fontWeight: '800',
            color: AZUL,
        },

        horariosGrade: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },

        horarioOpcao: {
            width: '31%',
            minHeight: 48,
            borderWidth: 1,
            borderColor: BORDA,
            borderRadius: 12,
            backgroundColor:
                FUNDO,
            flexDirection: 'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            gap: 7,
            paddingHorizontal:
                8,
        },

        horarioOpcaoSelecionado:
        {
            borderColor:
                AZUL,
            backgroundColor:
                AZUL_CLARO,
        },

        horarioOpcaoTexto: {
            fontSize: 14,
            fontWeight: '700',
            color:
                TEXTO_PRINCIPAL,
        },

        horarioOpcaoTextoSelecionado:
        {
            color: AZUL,
        },

        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor:
                '#AAB2C0',
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        checkboxSelecionado: {
            backgroundColor:
                AZUL,
            borderColor: AZUL,
        },

        infoAula: {
            marginTop: 10,
            marginBottom: 4,
            color:
                TEXTO_SECUNDARIO,
            fontSize: 13,
        },

        repeticaoOpcao: {
            flexDirection: 'row',
            alignItems:
                'center',
            gap: 12,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: BORDA,
            marginBottom: 10,
        },

        repeticaoOpcaoSelecionada:
        {
            borderColor:
                AZUL,
            backgroundColor:
                AZUL_CLARO,
        },

        radio: {
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor:
                '#AAB2C0',
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        radioSelecionado: {
            borderColor: AZUL,
        },

        radioCentro: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor:
                AZUL,
        },

        repeticaoTitulo: {
            fontSize: 14,
            fontWeight: '800',
            color:
                TEXTO_PRINCIPAL,
        },

        repeticaoDescricao: {
            fontSize: 12,
            color:
                TEXTO_SECUNDARIO,
            marginTop: 2,
            lineHeight: 17,
        },

        resumoCriacao: {
            marginTop: 8,
            backgroundColor:
                AZUL_CLARO,
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems:
                'center',
            gap: 8,
        },

        resumoCriacaoTexto:
        {
            flex: 1,
            fontSize: 12,
            color: AZUL,
            fontWeight:
                '600',
        },

        botaoSalvar: {
            height: 52,
            borderRadius: 14,
            backgroundColor:
                AZUL,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginTop: 26,
        },

        botaoSalvarDesabilitado:
        {
            opacity: 0.5,
        },

        botaoSalvarTexto: {
            color: '#FFFFFF',
            fontWeight: '800',
            fontSize: 15,
        },

        botaoCancelarModal:
        {
            height: 52,
            borderRadius: 14,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginTop: 10,
        },

        botaoCancelarModalTexto:
        {
            color:
                TEXTO_SECUNDARIO,
            fontWeight:
                '700',
            fontSize: 14,
        },
        grupoCabecalho: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            gap: 12,
        },

        botaoApagarDia: {
            minHeight: 34,
            paddingHorizontal: 10,

            borderRadius: 10,

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            gap: 5,

            backgroundColor:
                VERMELHO_FUNDO,
        },

        botaoApagarDiaTexto: {
            fontSize: 12,
            fontWeight: '800',
            color: '#B42318',
        },
    });