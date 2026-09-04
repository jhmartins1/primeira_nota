interface Endereco {
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    uf?: string | null;
}

export function formatarEnderecoCompleto(endereco: Endereco) {
    const partes = [
        endereco.logradouro,
        endereco.numero,
        endereco.complemento,
        endereco.bairro,
        endereco.cidade && endereco.uf
            ? `${endereco.cidade} - ${endereco.uf}`
            : endereco.cidade,
    ].filter(Boolean);

    return partes.join(', ');
}

export function gerarLinkGoogleMaps(endereco: Endereco) {
    const enderecoTexto = formatarEnderecoCompleto(endereco);

    if (!enderecoTexto) {
        return null;
    }

    const query = encodeURIComponent(enderecoTexto);

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}