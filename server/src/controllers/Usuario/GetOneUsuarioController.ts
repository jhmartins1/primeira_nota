import type { Request, Response } from 'express';
import { GetOneUsuarioService } from '../../services/Usuario/GetOneUsuarioService';

export class GetOneUsuarioController {
    async handle(req: Request, res: Response) {
        if (!req.usuarioId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const service = new GetOneUsuarioService();

        try {
            const usuario = await service.execute(req.usuarioId);
            return res.json(usuario);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}