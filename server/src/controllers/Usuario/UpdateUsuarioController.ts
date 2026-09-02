import type { Request, Response } from 'express';
import { UpdateUsuarioService } from '../../services/Usuario/UpdateUsuarioService';

export class UpdateUsuarioController {
    async handle(req: Request, res: Response) {
        if (!req.usuarioId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { phone } = req.body;

        const service = new UpdateUsuarioService();
        const usuario = await service.execute({ id: req.usuarioId, phone });

        if (usuario instanceof Error) {
            return res.status(400).json({ error: usuario.message });
        }

        return res.json(usuario);
    }
}