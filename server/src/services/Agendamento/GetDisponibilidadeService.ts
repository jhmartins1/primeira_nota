import { prisma } from '../../prisma/client';
import { HORARIOS_DISPONIVEIS } from '../../utils/horarios';

interface GetDisponibilidadeDTO {
    instrumentoId: number;
    nivelId: number;
    professorId?: number;
}

export class GetDisponibilidadeService {
    async execute({
        instrumentoId,
        nivelId,
        professorId,
    }: GetDisponibilidadeDTO) {
        // Verifica se o instrumento existe
        const instrumento = await prisma.instrumento.findUnique({
            where: {
                id: instrumentoId,
            },
        });

        if (!instrumento) {
            throw new Error('Instrumento não encontrado.');
        }

        // Verifica se o nível existe
        const nivel = await prisma.nivel.findUnique({
            where: {
                id: nivelId,
            },
        });

        if (!nivel) {
            throw new Error('Nível não encontrado.');
        }

        // Busca professores que ensinam
        // o instrumento + nível informado
        const professores =
            await prisma.professorInstrumento.findMany({
                where: {
                    instrumentoId,
                    nivelId,
                    ...(professorId
                        ? {
                            professorId,
                        }
                        : {}),
                },
                include: {
                    professor: true,
                },
            });

        if (professores.length === 0) {
            return [];
        }

        const professorIds = professores.map(
            (item) => item.professorId
        );

        /*
         * Amanhã
         */
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        /*
         * Limite: hoje + 7 dias
         */
        const limite = new Date(hoje);
        limite.setDate(limite.getDate() + 7);

        /*
         * Busca os agendamentos existentes
         * dentro do período.
         */
        const agendamentos =
            await prisma.agendamento.findMany({
                where: {
                    professorId: {
                        in: professorIds,
                    },

                    dataHora: {
                        gte: amanha,
                        lte: limite,
                    },

                    status: 'AGENDADO',
                },

                select: {
                    professorId: true,
                    dataHora: true,
                },
            });

        /*
         * Cria um Set para consultar rapidamente
         * os horários ocupados.
         */
        const horariosOcupados = new Set(
            agendamentos.map((agendamento) => {
                return `${agendamento.professorId}_${agendamento.dataHora.getTime()}`;
            })
        );

        const disponibilidade: any[] = [];

        /*
         * Gera:
         *
         * amanhã
         * +2 dias
         * +3 dias
         * ...
         * +7 dias
         */
        for (
            let dataAtual = new Date(amanha);
            dataAtual <= limite;
            dataAtual.setDate(dataAtual.getDate() + 1)
        ) {
            const data = new Date(dataAtual);

            const dataFormatada = `${data.getFullYear()}-${String(
                data.getMonth() + 1
            ).padStart(2, '0')}-${String(
                data.getDate()
            ).padStart(2, '0')}`;

            /*
             * Para cada professor elegível
             */
            for (const professor of professores) {
                const horarios: string[] = [];

                /*
                 * Para cada horário permitido
                 */
                for (const horario of HORARIOS_DISPONIVEIS) {
                    const partes = horario.split(':');

                    const hora = Number(partes[0]);
                    const minuto = Number(partes[1]);

                    const dataHora = new Date(data);

                    dataHora.setHours(hora, minuto, 0, 0);

                    const chave = `${professor.professorId}_${dataHora.getTime()}`;

                    if (!horariosOcupados.has(chave)) {
                        horarios.push(horario);
                    }
                }

                if (horarios.length > 0) {
                    disponibilidade.push({
                        data: dataFormatada,

                        professor: {
                            id: professor.professor.id,
                            name: professor.professor.name,
                            image: professor.professor.image,
                        },

                        instrumento: {
                            id: instrumento.id,
                            name: instrumento.name,
                        },

                        nivel: {
                            id: nivel.id,
                            name: nivel.name,
                        },

                        horarios,
                    });
                }
            }
        }

        return disponibilidade;
    }
}