export type HorarioDisponivel = {
    data: string;      // 'YYYY-MM-DD'
    diaSemana: string; // 'Seg', 'Ter', ...
    diaMes: string;    // '25'
    horarios: string[];
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HORARIOS_BASE = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

function hashSimples(texto: string): number {
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        hash = (hash * 31 + texto.charCodeAt(i)) >>> 0;
    }
    return hash;
}

// Gera disponibilidade determinística (mock) pros próximos `dias` dias,
// pra cada professor ter uma agenda diferente sem precisar de backend ainda.
export function gerarDisponibilidade(professorId: number, dias = 7): HorarioDisponivel[] {
    const resultado: HorarioDisponivel[] = [];
    const hoje = new Date();

    for (let i = 0; i < dias; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        const dataIso = data.toISOString().slice(0, 10);

        const seed = hashSimples(`${professorId}-${dataIso}`);

        const horarios = HORARIOS_BASE.filter((_, index) => (seed >> index) % 3 !== 0);

        resultado.push({
            data: dataIso,
            diaSemana: DIAS_SEMANA[data.getDay()],
            diaMes: String(data.getDate()).padStart(2, '0'),
            horarios,
        });
    }

    return resultado;
}