import type { Request, Response } from 'express';
import { CreateProfessorService } from '../../services/Professor/CreateProfessorService';

export class CreateProfessorController {
    async handle(req: Request, res: Response) {
        const { name, email, phone, image, instrumentos } = req.body;

        const createProfessorService = new CreateProfessorService();
        const professor = await createProfessorService.execute({ name, email, phone, image, instrumentos });

        if (professor instanceof Error) {
            return res.status(400).json({ error: professor.message });
        }

        return res.json(professor);
    }
}