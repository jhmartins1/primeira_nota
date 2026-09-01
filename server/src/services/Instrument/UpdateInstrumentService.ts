import { prisma } from '../../prisma/client'

export class UpdateInstrumentService {
    async execute(id: number, name: string) {
        const instrumentExists = await prisma.instrumento.findUnique({
            where: { id }
        });
        if (!instrumentExists) {
            return new Error('Instrument not found');
        }
        const instrument = await prisma.instrumento.update({
            where: { id },
            data: { name }
        });
        return instrument;
    }
}