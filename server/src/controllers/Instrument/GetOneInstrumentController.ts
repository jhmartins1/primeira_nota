import type { Request, Response } from "express";
import { GetOneInstrumentService } from "../../services/Instrument/GetOneInstrumentService";

export class GetOneInstrumentController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const getOneInstrumentService = new GetOneInstrumentService();
        const instrument = await getOneInstrumentService.execute(Number(id));
        if (instrument instanceof Error) {
            return res.status(400).json({ error: instrument.message });
        }
        return res.json(instrument);
    }
}