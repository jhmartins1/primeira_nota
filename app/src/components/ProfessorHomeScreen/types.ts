export interface Aluno {
    id: number;
    name: string;
    image?: string | null;
    phone?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    uf?: string | null;
}

export interface AgendamentoProfessor {
    id: number;
    usuarioId: number;
    professorId: number;
    instrumentoId: number;
    nivelId: number;
    dataHora: string;
    status: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO';
    usuario: Aluno;
    instrumento: { id: number; name: string };
    nivel: { id: number; name: string };
}

export interface ProfessorLogado {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
}