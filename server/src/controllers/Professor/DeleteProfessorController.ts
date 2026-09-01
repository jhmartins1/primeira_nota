import type { Request, Response } from 'express';
import { DeleteProfessorService } from '../../services/Professor/DeleteProfessorService';

export class DeleteProfessorController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const deleteProfessorService = new DeleteProfessorService();
        const professor = await deleteProfessorService.execute(Number(id));
        if (professor instanceof Error) {
            return res.status(400).json({ error: professor.message });
        }
        return res.status(200).json({ message: 'Professor deleted successfully' });
    }
}