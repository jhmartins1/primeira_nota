import { prisma } from "../../prisma/client";

export class GetAllInstrumentService {
    async execute() {
        const instruments = await prisma.instrumento.findMany({
            orderBy: {
                name: 'desc'
            }
        });
        return instruments;
    }
}