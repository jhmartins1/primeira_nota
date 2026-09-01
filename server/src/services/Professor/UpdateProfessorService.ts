import { prisma } from '../../prisma/client'
import { flattenInstrumentoNiveis } from '../../utils/instrumentNivel';
import type { InstrumentoNiveis } from '../../utils/instrumentNivel';

interface UpdateProfessorRequest {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    instrumentos?: InstrumentoNiveis[];
}

export class UpdateProfessorService {
    async execute({ id, name, email, phone, image, instrumentos: instrumentosRaw }: UpdateProfessorRequest) {
        const professorExists = await prisma.professor.findUnique({
            where: { id }
        });

        if (!professorExists) {
            return new Error('Professor not found');
        }

        if (email) {
            const emailExists = await prisma.professor.findUnique({
                where: { email }
            });

            if (emailExists && emailExists.id !== id) {
                return new Error('Email already in use');
            }
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
            const professor = await prisma.$transaction(async (tx) => {
                if (instrumentos) {
                    await tx.professorInstrumento.deleteMany({
                        where: { professorId: id }
                    });

                    if (instrumentos.length > 0) {
                        await tx.professorInstrumento.createMany({
                            data: instrumentos.map(({ instrumentoId, nivelId }) => ({
                                professorId: id,
                                instrumentoId,
                                nivelId,
                            }))
                        });
                    }
                }

                return tx.professor.update({
                    where: { id },
                    data: {
                        ...(name !== undefined && { name }),
                        ...(email !== undefined && { email }),
                        ...(phone !== undefined && { phone }),
                        ...(image !== undefined && { image }),
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
            });

            return professor;
        } catch (error) {
            console.error('Error updating professor:', error);
            return new Error('Could not update professor');
        }
    }
}