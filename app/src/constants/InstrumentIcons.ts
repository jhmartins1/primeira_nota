import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

type IconeInstrumento =
    | { familia: 'material'; nome: keyof typeof MaterialCommunityIcons.glyphMap }
    | { familia: 'fontawesome5'; nome: keyof typeof FontAwesome5.glyphMap };

const MAPA_ICONES: Record<string, IconeInstrumento> = {
    'Violão': { familia: 'material', nome: 'guitar-acoustic' },
    'Guitarra': { familia: 'material', nome: 'guitar-electric' },
    'Teclado': { familia: 'material', nome: 'piano' },
    'Piano': { familia: 'material', nome: 'piano' },
    'Bateria': { familia: 'fontawesome5', nome: 'drum' },
};

export function getInstrumentIcon(instrumento: string): IconeInstrumento {
    return MAPA_ICONES[instrumento] ?? { familia: 'material', nome: 'music-note' };
}