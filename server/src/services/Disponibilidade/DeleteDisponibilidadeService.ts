import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface DeleteDisponibilidadeDTO {
    professorId: number;
    disponibilidadeId: number;
}

export class DeleteDisponibilidadeService {
    async execute({
        professorId,
        disponibilidadeId,
    }: DeleteDisponibilidadeDTO) {
        // ----------------------------------------------------
        // 1. VALIDAR PROFESSOR
        // ----------------------------------------------------

        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        // ----------------------------------------------------
        // 2. VALIDAR DISPONIBILIDADE
        // ----------------------------------------------------

        if (
            !Number.isInteger(
                disponibilidadeId
            ) ||
            disponibilidadeId <= 0
        ) {
            throw new AppError(
                'Disponibilidade inválida.',
                400
            );
        }

        // ----------------------------------------------------
        // 3. BUSCAR DISPONIBILIDADE
        // ----------------------------------------------------

        const disponibilidade =
            await prisma.disponibilidade.findUnique({
                where: {
                    id: disponibilidadeId,
                },
            });

        if (
            !disponibilidade ||
            disponibilidade.professorId !==
            professorId
        ) {
            throw new AppError(
                'Disponibilidade não encontrada.',
                404
            );
        }

        // ----------------------------------------------------
        // 4. VERIFICAR SE EXISTE AULA AGENDADA
        // EXATAMENTE NESSE HORÁRIO
        //
        // Não usamos mais o intervalo
        // horaInicio -> horaFim.
        //
        // Exemplo:
        //
        // disponibilidade: 10:40
        //
        // só impede remoção se existir uma
        // aula começando exatamente às 10:40.
        // ----------------------------------------------------

        const agendamentoConflitante =
            await prisma.agendamento.findFirst({
                where: {
                    professorId,

                    status: 'AGENDADO',

                    dataHora:
                        disponibilidade.horaInicio,
                },
            });

        if (agendamentoConflitante) {
            throw new AppError(
                'Já existe uma aula agendada nesse horário. Cancele a aula antes de remover este horário.',
                409
            );
        }

        // ----------------------------------------------------
        // 5. REMOVER DISPONIBILIDADE
        // ----------------------------------------------------

        await prisma.disponibilidade.delete({
            where: {
                id: disponibilidadeId,
            },
        });

        return {
            message:
                'Disponibilidade removida com sucesso.',
        };
    }
}