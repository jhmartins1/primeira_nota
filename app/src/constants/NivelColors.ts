import { colors } from '../theme/colors';
interface NivelColor {
    cor: string;
    fundo: string;
}

const CORES_NIVEL: Record<string, NivelColor> = {
    Iniciante: { cor: colors.success, fundo: colors.successSoft },
    Intermediário: { cor: colors.amberText, fundo: colors.yellowSoft },
    Avançado: { cor: colors.orangeText, fundo: colors.orangeSoft },
};

const PADRAO: NivelColor = { cor: colors.amberText, fundo: colors.yellowSoft };

export function getCorNivel(nivel: string): NivelColor {
    return CORES_NIVEL[nivel] ?? PADRAO;
}