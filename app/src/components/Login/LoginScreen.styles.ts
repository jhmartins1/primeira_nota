import { StyleSheet } from 'react-native';

const AZUL = '#093373';
const AZUL_ESCURO = '#061F45';
const AZUL_CLARO = '#1554A6';

export const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,

            backgroundColor:
                AZUL_ESCURO,
        },

        container: {
            flex: 1,

            backgroundColor: AZUL,

            overflow: 'hidden',
        },

        //ELEMENTOS DECORATIVOS
        circuloDecorativoGrande: {
            position: 'absolute',

            width: 330,
            height: 330,

            borderRadius: 165,

            backgroundColor:
                'rgba(255,255,255,0.035)',

            top: -120,
            right: -120,
        },

        circuloDecorativoPequeno: {
            position: 'absolute',

            width: 180,
            height: 180,

            borderRadius: 90,

            backgroundColor:
                'rgba(255,255,255,0.035)',

            bottom: 170,
            left: -100,
        },

        notaMusicalUm: {
            position: 'absolute',

            top: 105,
            right: 30,

            transform: [
                {
                    rotate: '12deg',
                },
            ],
        },

        notaMusicalDois: {
            position: 'absolute',

            top: 185,
            left: 25,

            transform: [
                {
                    rotate:
                        '-15deg',
                },
            ],
        },

        claveMusical: {
            position: 'absolute',

            top: 55,
            left: -15,
        },

        //HERO
        hero: {
            flex: 1,

            alignItems:
                'center',

            justifyContent:
                'center',

            paddingHorizontal:
                28,

            paddingTop: 20,

            paddingBottom: 30,
        },

        //LOGO
        logoContainer: {
            width: 145,
            height: 145,

            borderRadius: 42,

            backgroundColor:
                '#FFFFFF',

            alignItems:
                'center',

            justifyContent:
                'center',

            marginBottom: 24,

            elevation: 10,

            shadowColor: '#000',

            shadowOffset: {
                width: 0,
                height: 8,
            },

            shadowOpacity:
                0.18,

            shadowRadius: 18,
        },

        logo: {
            width: 125,
            height: 125,
        },

        //TÍTULO
        titulo: {
            fontSize: 27,

            fontWeight: '700',

            color: '#FFFFFF',

            textAlign: 'center',

            letterSpacing:
                -0.5,
        },

        tituloDestaque: {
            fontSize: 30,

            fontWeight: '900',

            color: '#FFFFFF',

            textAlign: 'center',

            marginTop: 2,

            letterSpacing:
                -0.8,
        },

        subtitulo: {
            width: '90%',

            fontSize: 14,

            lineHeight: 21,

            color:
                'rgba(255,255,255,0.72)',

            textAlign: 'center',

            marginTop: 14,
        },

        //INSTRUMENTOS
        instrumentos: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap: 10,

            marginTop: 24,
        },

        instrumento: {
            width: 42,
            height: 42,

            borderRadius: 14,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                'rgba(255,255,255,0.10)',

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.12)',
        },

        //CARD LOGIN
        loginCard: {
            backgroundColor:
                '#FFFFFF',

            borderTopLeftRadius:
                30,

            borderTopRightRadius:
                30,

            paddingHorizontal:
                24,

            paddingTop: 16,

            paddingBottom: 16,

            elevation: 20,

            shadowColor: '#000',

            shadowOffset: {
                width: 0,
                height: -5,
            },

            shadowOpacity:
                0.12,

            shadowRadius: 20,
        },

        indicador: {
            width: 42,
            height: 4,

            borderRadius: 2,

            backgroundColor:
                '#D9E2F0',

            alignSelf:
                'center',

            marginBottom: 18,
        },

        loginTitulo: {
            fontSize: 21,

            fontWeight: '800',

            color: '#111827',

            textAlign: 'center',
        },

        loginSubtitulo: {
            fontSize: 13,

            lineHeight: 19,

            color: '#6B7280',

            textAlign: 'center',

            marginTop: 7,

            marginBottom: 18,

            paddingHorizontal:
                12,
        },


        //GOOGLE
        botaoGoogle: {
            width: '100%',

            height: 56,

            borderRadius: 16,

            backgroundColor:
                '#FFFFFF',

            borderWidth: 1.5,

            borderColor:
                '#DCE4EF',

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'center',

            elevation: 3,

            shadowColor:
                '#093373',

            shadowOffset: {
                width: 0,
                height: 3,
            },

            shadowOpacity:
                0.08,

            shadowRadius: 6,
        },

        botaoDesabilitado: {
            opacity: 0.6,
        },

        googleIconContainer: {
            width: 32,
            height: 32,

            borderRadius: 10,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#F5F8FC',

            marginRight: 10,
        },

        googleIcon: {
            fontSize: 21,

            fontWeight: '800',

            color: '#4285F4',
        },

        botaoGoogleTexto: {
            fontSize: 15,

            fontWeight: '700',

            color: '#1F2937',
        },

        setaGoogle: {
            position: 'absolute',

            right: 18,
        },

        //TERMOS
        linhaTermos: {
            flexDirection:
                'row',

            alignItems:
                'flex-start',

            justifyContent:
                'center',

            marginTop: 15,

            paddingHorizontal:
                8,
        },

        termos: {
            flex: 1,

            marginLeft: 6,

            fontSize: 10.5,

            lineHeight: 15,

            color: '#9CA3AF',

            textAlign: 'center',
        },

        //MADE BY
        madeByContainer: {
            alignSelf: 'center',

            marginTop: 10,

            paddingHorizontal: 8,

            paddingVertical: 3,
        },

        madeByTexto: {
            fontSize: 8.5,

            color: '#D1D5DB',

            textAlign: 'center',

            fontWeight: '400',

            letterSpacing: 0.2,
        },

        madeByNick: {
            color: '#B6BDC7',

            fontWeight: '700',
        },
    });