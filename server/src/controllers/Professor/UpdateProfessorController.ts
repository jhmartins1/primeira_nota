import type { Request, Response } from "express";
import { UpdateProfessorService } from "../../services/Professor/UpdateProfessorService";

export class UpdateProfessorController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, phone, image, instrumentos } = req.body;

        const updateProfessorService = new UpdateProfessorService();
        const professor = await updateProfessorService.execute({
            id: Number(id),
            name,
            email,
            phone,
            image,
            instrumentos
        });

        if (professor instanceof Error) {
            return res.status(400).json({ error: professor.message });
        }

        return res.json(professor);
    }
}