import { prisma } from '../../prisma/client'
import { flattenInstrumentoNiveis } from '../../utils/instrumentNivel';
import type { InstrumentoNiveis } from '../../utils/instrumentNivel';

interface CreateProfessorRequest {
    name: string;
    email: string;
    phone: string;
    image?: string;
    instrumentos?: InstrumentoNiveis[];
}

export class CreateProfessorService {
    async execute({ name, email, phone, image, instrumentos: instrumentosRaw }: CreateProfessorRequest) {
        if (!name || !email || !phone) {
            return new Error('Name, email and phone are required');
        }

        const emailExists = await prisma.professor.findUnique({
            where: { email }
        });

        if (emailExists) {
            return new Error('Professor with this email already exists');
        }

        const instrumentos = instrumentosRaw ? flattenInstrumentoNiveis(instrumentosRaw) : undefined;

        if (instrumentos && instrumentos.length > 0) {
            const instrumentoIds = [...new Set(instrumentos.map(i => i.instrumentoId))];
            const nivelIds = [...new Set(instrumentos.map(i => i.nivelId))];

            const [instrumentosEncontrados, niveisEncontrados] = await Promise.all([
                prisma.instrumento.findMany({
                    where: { id: { in: instrumentoIds } },
                    select: { id: true }
                }),
                prisma.nivel.findMany({
                    where: { id: { in: nivelIds } },
                    select: { id: true }
                })
            ]);

            const instrumentoIdsEncontrados = new Set(instrumentosEncontrados.map(i => i.id));
            const nivelIdsEncontrados = new Set(niveisEncontrados.map(n => n.id));

            const instrumentoFaltando = instrumentoIds.find(id => !instrumentoIdsEncontrados.has(id));
            if (instrumentoFaltando !== undefined) {
                return new Error(`Instrumento with id ${instrumentoFaltando} does not exist`);
            }

            const nivelFaltando = nivelIds.find(id => !nivelIdsEncontrados.has(id));
            if (nivelFaltando !== undefined) {
                return new Error(`Nivel with id ${nivelFaltando} does not exist`);
            }
        }

        try {
            const professor = await prisma.professor.create({
                data: {
                    name,
                    email,
                    phone,
                    ...(image !== undefined && { image }),
                    ...(instrumentos && instrumentos.length > 0 && {
                        instrumentos: {
                            create: instrumentos.map(({ instrumentoId, nivelId }) => ({
                                instrumento: { connect: { id: instrumentoId } },
                                nivel: { connect: { id: nivelId } },
                            }))
                        }
                    })
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                    instrumentos: {
                        select: {
                            instrumento: { select: { id: true, name: true } },
                            nivel: { select: { id: true, name: true } },
                        }
                    }
                }
            });

            return professor;
        } catch (error) {
            console.error('Error creating professor:', error);
            return new Error('Could not create professor');
        }
    }
}