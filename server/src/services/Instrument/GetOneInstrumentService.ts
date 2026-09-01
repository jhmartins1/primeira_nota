import { prisma } from '../../prisma/client'

export class GetOneInstrumentService {
    async execute(id: number) {
        const instrument = await prisma.instrumento.findUnique({
            where: {
                id,
            }
        })
        if (!instrument) {
            throw new Error('Instrument not found');
        }
        return instrument;
    }
}
