import type { Request, Response } from 'express';

export class GetMinhaContaController {
    async handle(req: Request, res: Response) {
        try {
            if (req.tipoConta === 'usuario') {
                return res.json({
                    tipoConta: 'usuario',
                    id: req.usuarioId,
                });
            }

            if (req.tipoConta === 'professor') {
                return res.json({
                    tipoConta: 'professor',
                    id: req.professorId,
                });
            }

            return res.status(404).json({
                error: 'Conta não encontrada',
            });
        } catch (error) {
            console.error(
                'Erro ao identificar conta autenticada:',
                error
            );

            return res.status(500).json({
                error: 'Erro interno ao identificar conta',
            });
        }
    }
}