import type { Request, Response } from 'express';
import { prisma } from '../../prisma/client';

export class DeleteDisponibilidadeController {
    async handle(req: Request, res: Response) {
        try {
            if (req.tipoConta !== 'professor' || !req.professorId) {
                return res.status(403).json({ error: 'Acesso restrito a professores.' });
            }

            const { id } = req.params;

            const disponibilidade = await prisma.disponibilidade.findUnique({
                where: { id: Number(id) },
            });

            if (!disponibilidade || disponibilidade.professorId !== req.professorId) {
                return res.status(404).json({ error: 'Disponibilidade não encontrada.' });
            }

            const agendamentoConflitante = await prisma.agendamento.findFirst({
                where: {
                    professorId: req.professorId,
                    status: 'AGENDADO',
                    dataHora: {
                        gte: disponibilidade.horaInicio,
                        lt: disponibilidade.horaFim,
                    },
                },
            });

            if (agendamentoConflitante) {
                return res.status(409).json({
                    error:
                        'Já existe uma aula agendada nesse horário. Cancele a aula antes de remover este horário.',
                });
            }

            await prisma.disponibilidade.delete({
                where: { id: Number(id) },
            });

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao remover disponibilidade:', error);
            return res.status(500).json({ error: 'Erro interno ao remover disponibilidade.' });
        }
    }
}