import {
    FontAwesome5,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

type IconeInstrumento =
    | {
        familia: 'material';
        nome: keyof typeof MaterialCommunityIcons.glyphMap;
    }
    | {
        familia: 'fontawesome5';
        nome: keyof typeof FontAwesome5.glyphMap;
    };

const MAPA_ICONES: Record<string, IconeInstrumento> = {
    Violão: {
        familia: 'material',
        nome: 'guitar-acoustic',
    },

    Guitarra: {
        familia: 'material',
        nome: 'guitar-electric',
    },

    Baixo: {
        familia: 'material',
        nome: 'guitar-pick',
    },

    Teclado: {
        familia: 'material',
        nome: 'keyboard-outline',
    },

    Piano: {
        familia: 'material',
        nome: 'piano',
    },

    Bateria: {
        familia: 'fontawesome5',
        nome: 'drum',
    },

    Ukulele: {
        familia: 'fontawesome5',
        nome: 'music',
    },

    Flauta: {
        familia: 'material',
        nome: 'music-note',
    },
};

export function getInstrumentIcon(
    instrumento: string
): IconeInstrumento {
    return (
        MAPA_ICONES[instrumento] ?? {
            familia: 'material',
            nome: 'music-note',
        }
    );
}