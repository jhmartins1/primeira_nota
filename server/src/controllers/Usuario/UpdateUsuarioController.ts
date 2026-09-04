import type { Request, Response } from 'express';

import { UpdateUsuarioService } from '../../services/Usuario/UpdateUsuarioService';

export class UpdateUsuarioController {
    async handle(req: Request, res: Response) {
        if (!req.clerkId) {
            return res.status(401).json({
                error: 'Não autenticado',
            });
        }

        const {
            phone,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
        } = req.body;

        const service = new UpdateUsuarioService();

        const usuario = await service.execute({
            clerkId: req.clerkId,
            phone,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
        });

        if (usuario instanceof Error) {
            return res.status(400).json({
                error: usuario.message,
            });
        }

        return res.json(usuario);
    }
}