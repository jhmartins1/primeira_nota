import type { Request, Response } from 'express';
import { VincularContaProfessorService } from '../../services/Professor/VincularContaProfessorService';

export class VincularContaProfessorController {
    async handle(req: Request, res: Response) {
        if (!req.clerkId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const service = new VincularContaProfessorService();

        try {
            const professor = await service.execute(req.clerkId);
            return res.json(professor);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}