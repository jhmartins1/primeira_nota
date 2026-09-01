import type { Request, Response } from "express";
import { UpdateInstrumentService } from "../../services/Instrument/UpdateInstrumentService";

export class UpdateInstrumentController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        const updateInstrumentService = new UpdateInstrumentService();
        const instrument = await updateInstrumentService.execute(Number(id), name);
        if (instrument instanceof Error) {
            return res.status(400).json({ error: instrument.message });
        }
        return res.json(instrument);
    }
}