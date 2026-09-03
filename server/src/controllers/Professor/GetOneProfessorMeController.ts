import type { Request, Response } from 'express';
import { GetOneProfessorMeService } from '../../services/Professor/GetOneProfessorMeService';

export class GetOneProfessorMeController {
    async handle(req: Request, res: Response) {
        if (!req.professorId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const service = new GetOneProfessorMeService();

        try {
            const professor = await service.execute(req.professorId);
            return res.json(professor);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}