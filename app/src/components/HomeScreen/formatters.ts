export function formatarDataBrasilia(dataHora: string) {
    const data = new Date(dataHora);
    const brasilia = new Date(data.getTime() - 3 * 60 * 60 * 1000);

    const dia = String(brasilia.getUTCDate()).padStart(2, '0');
    const mes = String(brasilia.getUTCMonth() + 1).padStart(2, '0');
    const ano = brasilia.getUTCFullYear();
    const hora = String(brasilia.getUTCHours()).padStart(2, '0');
    const minuto = String(brasilia.getUTCMinutes()).padStart(2, '0');

    return {
        data: `${dia}/${mes}/${ano}`,
        hora: `${hora}:${minuto}`,
    };
}

export function formatarDiaSemana(dataHora: string) {
    const data = new Date(dataHora);
    const brasilia = new Date(data.getTime() - 3 * 60 * 60 * 1000);

    return brasilia
        .toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'UTC' })
        .replace(/^./, (letra) => letra.toUpperCase());
}