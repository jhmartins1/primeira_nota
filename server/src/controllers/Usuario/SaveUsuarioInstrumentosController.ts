import type { Request, Response } from 'express';
import { SaveUsuarioInstrumentosService } from '../../services/Usuario/SaveUsuarioInstrumentosService';

export class SaveUsuarioInstrumentosController {
    async handle(req: Request, res: Response) {
        if (!req.usuarioId) {
            return res.status(401).json({
                error: 'Não autenticado',
            });
        }

        try {
            const { instrumentos } = req.body;

            if (!Array.isArray(instrumentos)) {
                return res.status(400).json({
                    error: 'Instrumentos inválidos',
                });
            }

            const service =
                new SaveUsuarioInstrumentosService();

            const resultado = await service.execute(
                req.usuarioId,
                instrumentos
            );

            return res.status(200).json(resultado);
        } catch (error) {
            console.error(
                'Erro ao salvar instrumentos:',
                error
            );

            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message,
                });
            }

            return res.status(500).json({
                error: 'Erro interno',
            });
        }
    }
}