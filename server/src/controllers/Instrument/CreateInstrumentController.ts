import type { Request, Response } from 'express';
import { CreateInstrumentService } from '../../services/Instrument/CreateInstrumentService';

export class CreateInstrumentController {
    async handle(req: Request, res: Response) {
        const { name } = req.body;
        const createInstrumentService = new CreateInstrumentService();
        const instrument = await createInstrumentService.execute(name);
        if (instrument instanceof Error) {
            return res.status(400).json({ error: instrument.message });
        }
        return res.json(instrument);
    }
}