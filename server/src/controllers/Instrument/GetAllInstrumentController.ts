import type { Request, Response } from 'express';
import { GetAllInstrumentService } from '../../services/Instrument/GetAllInstrumentService';

export class GetAllInstrumentController {
    async handle(req: Request, res: Response) {
        const service = new GetAllInstrumentService();
        const instruments = await service.execute();
        return res.json(instruments);
    }
}