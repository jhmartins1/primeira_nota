import { prisma } from '../../prisma/client'

export class DeleteInstrumentService {
    async execute(id: number) {
        const instrumentExists = await prisma.instrumento.findUnique({
            where: {
                id,
            },
        });
        if (!instrumentExists) {
            throw new Error('Instrument not found');
        }
        const instrument = await prisma.instrumento.delete({
            where: {
                id,
            },
        })
        return instrument;
    }
}