import type { Request, Response } from 'express';
import { GetOneProfessorService } from '../../services/Professor/GetOneProfessorService';

export class GetOneProfessorController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const service = new GetOneProfessorService();

        try {
            const professor = await service.execute(Number(id));
            return res.json(professor);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}