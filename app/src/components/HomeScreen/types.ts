export interface InstrumentoUsuario {
    instrumento: string;
    nivel: string;
}

export interface Professor {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    image?: string | null;
}

export interface Agendamento {
    id: number;
    usuarioId: number;
    professorId: number;
    instrumentoId: number;
    nivelId: number;
    dataHora: string;
    status: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO';
    professor: Professor;
    instrumento: { id: number; name: string };
    nivel: { id: number; name: string };
}

export interface Usuario {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    profileComplete: boolean;
    onboardingComplete: boolean;
    instrumentos: InstrumentoUsuario[];
}