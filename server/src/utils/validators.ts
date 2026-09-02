export function isTelefoneValido(phone: string): boolean {
    // aceita formatos como "61982351199" ou "5561982351199" (com DDI)
    const somenteNumeros = phone.replace(/\D/g, '');
    return somenteNumeros.length >= 10 && somenteNumeros.length <= 13;
}