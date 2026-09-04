import { useState } from 'react';

export interface EnderecoViaCep {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export function useBuscaCep() {
    const [buscando, setBuscando] = useState(false);
    const [erroCep, setErroCep] = useState('');

    async function buscarEnderecoPorCep(cep: string) {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            return null;
        }

        try {
            setBuscando(true);
            setErroCep('');

            const response = await fetch(
                `https://viacep.com.br/ws/${cepLimpo}/json/`
            );

            const data: EnderecoViaCep = await response.json();

            if (data.erro) {
                setErroCep('CEP não encontrado');
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setErroCep('Não foi possível buscar o CEP');
            return null;
        } finally {
            setBuscando(false);
        }
    }

    return { buscarEnderecoPorCep, buscando, erroCep };
}