import type { Request, Response } from 'express';
import { DeleteInstrumentService } from '../../services/Instrument/DeleteInstrumentService';

export class DeleteInstrumentController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const deleteInstrumentService = new DeleteInstrumentService();
        const instrument = await deleteInstrumentService.execute(Number(id));
        if (instrument instanceof Error) {
            return res.status(400).json({ error: instrument.message });
        }
        return res.status(200).json({ message: 'Instrument deleted successfully' });
    }
}