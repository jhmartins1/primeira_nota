import type { Request, Response } from 'express';
import { GetAgendamentosProfessorService } from '../../services/Agendamento/GetAgendamentosProfessorService';

export class GetAgendamentosProfessorController {
    async handle(req: Request, res: Response) {
        if (!req.professorId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const service = new GetAgendamentosProfessorService();

        try {
            const agendamentos = await service.execute(req.professorId);
            return res.json(agendamentos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}