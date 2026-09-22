import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

const AZUL = colors.navy;
const AZUL_ESCURO = colors.navyDeep;
const AZUL_CLARO = colors.navy;

export const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,

            backgroundColor:
                colors.surface,
        },

        container: {
            flexGrow: 1,

            backgroundColor: colors.surface,

            overflow: 'hidden',
        },

        //ELEMENTOS DECORATIVOS
        circuloDecorativoGrande: {
            position: 'absolute',

            width: 270,
            height: 270,

            borderRadius: 135,

            backgroundColor:
                colors.yellow,

            top: -175,
            right: -100,
        },

        circuloDecorativoPequeno: {
            position: 'absolute',

            width: 240,
            height: 240,

            borderRadius: 120,

            backgroundColor:
                colors.tealSoft,

            bottom: 180,
            left: -170,
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

            paddingTop: 24,

            paddingBottom: 28,
        },

        //LOGO
        logoContainer: {
            width: 170,
            height: 170,

            alignItems: 'center',
            justifyContent: 'center',

            marginBottom: 20,

            elevation: 0,

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0,
            shadowRadius: 18,
        },

        logo: {
            width: 170,
            height: 170,
            borderRadius: 0,
        },

        //TÍTULO
        titulo: {
            fontSize: 26,

            fontWeight: '800',

            color: colors.navy,

            textAlign: 'center',

            letterSpacing:
                -0.5,
        },

        tituloDestaque: {
            fontSize: 34,

            fontWeight: '900',

            color: colors.teal,

            textAlign: 'center',

            marginTop: 2,

            letterSpacing:
                -0.8,
        },

        subtitulo: {
            width: '90%',

            fontSize: 14,

            lineHeight: 22,

            color:
                colors.textSecondary,

            textAlign: 'center',

            marginTop: 12,
        },

        //INSTRUMENTOS
        instrumentos: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap: 10,

            marginTop: 20,
        },

        instrumento: {
            width: 42,
            height: 42,

            borderRadius: 15,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                colors.tealSoft,

            borderWidth: 1,

            borderColor:
                colors.tealBorder,
        },

        //CARD LOGIN
        loginCard: {
            backgroundColor:
                colors.navy,

            borderTopLeftRadius:
                32,

            borderTopRightRadius:
                32,

            paddingHorizontal:
                24,

            paddingTop: 18,

            paddingBottom: 20,

            elevation: 0,

            shadowColor: colors.navy,

            shadowOffset: {
                width: 0,
                height: -5,
            },

            shadowOpacity:
                0.08,

            shadowRadius: 20,
        },

        indicador: {
            width: 36,
            height: 4,

            borderRadius: 2,

            backgroundColor:
                colors.yellow,

            alignSelf:
                'center',

            marginBottom: 18,
        },

        loginTitulo: {
            fontSize: 22,

            fontWeight: '800',

            color: colors.surface,

            textAlign: 'center',
        },

        loginSubtitulo: {
            fontSize: 14,

            lineHeight: 20,

            color: '#CEDDEC',

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

            borderRadius: 17,

            backgroundColor:
                colors.surface,

            borderWidth: 1.5,

            borderColor:
                colors.surface,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'center',

            elevation: 0,

            shadowColor:
                colors.navy,

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
                colors.surface,

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

            color: colors.text,
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

            color: '#CEDDEC',

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

            color: '#AFC4D9',

            textAlign: 'center',

            fontWeight: '400',

            letterSpacing: 0.2,
        },

        madeByNick: {
            color: '#CEDDEC',

            fontWeight: '700',
        },
    });
