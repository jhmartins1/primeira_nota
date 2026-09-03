interface NivelColor {
    cor: string;
    fundo: string;
}

const CORES_NIVEL: Record<string, NivelColor> = {
    Iniciante: { cor: '#2E8B57', fundo: '#EAF6EF' },
    Intermediário: { cor: '#B8842E', fundo: '#FBF1DE' },
    Avançado: { cor: '#6D28D9', fundo: '#F2EBFC' },
};

const PADRAO: NivelColor = { cor: '#B8842E', fundo: '#FBF1DE' };

export function getCorNivel(nivel: string): NivelColor {
    return CORES_NIVEL[nivel] ?? PADRAO;
}