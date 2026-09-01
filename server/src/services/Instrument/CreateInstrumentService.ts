import { prisma } from '../../prisma/client'

export class CreateInstrumentService {
    async execute(name: string) {
        const instrument = await prisma.instrumento.create({
            data: {
                name,
            }
        })
        if (!instrument) {
            return new Error('Instrument could not be created');
        }
        return instrument;
    }
}