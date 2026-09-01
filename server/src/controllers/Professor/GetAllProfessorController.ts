import type { Request, Response } from 'express';
import { GetAllProfessorService } from '../../services/Professor/GetAllProfessorService';

export class GetAllProfessorController {
    async handle(req: Request, res: Response) {
        const service = new GetAllProfessorService();
        const professors = await service.execute();
        return res.json(professors);
    }
}