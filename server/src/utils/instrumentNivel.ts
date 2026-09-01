export interface InstrumentoNivel {
    instrumentoId: number;
    nivelId: number;
}

export interface InstrumentoNiveis {
    instrumentoId: number;
    nivelIds: number[];
}

export function flattenInstrumentoNiveis(instrumentos: InstrumentoNiveis[]): InstrumentoNivel[] {
    return instrumentos.flatMap(({ instrumentoId, nivelIds }) =>
        nivelIds.map(nivelId => ({ instrumentoId, nivelId }))
    );
}