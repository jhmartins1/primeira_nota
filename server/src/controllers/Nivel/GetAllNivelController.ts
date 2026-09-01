import type { Request, Response } from 'express';
import { GetAllNivelService } from '../../services/Nivel/GetAllNivelService';

export class GetAllNivelController {
    async handle(req: Request, res: Response) {
        const service = new GetAllNivelService();
        const niveis = await service.execute();
        return res.json(niveis);
    }
}