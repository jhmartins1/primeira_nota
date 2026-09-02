import type { Request, Response } from 'express';
import { Webhook } from 'svix';
import { ClerkWebhookService } from '../../services/Usuario/ClerkWebhookService';

export class ClerkWebhookController {
    async handle(req: Request, res: Response) {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('CLERK_WEBHOOK_SECRET não configurado');
            return res.status(500).json({ error: 'Webhook não configurado' });
        }

        const svixId = req.headers['svix-id'] as string;
        const svixTimestamp = req.headers['svix-timestamp'] as string;
        const svixSignature = req.headers['svix-signature'] as string;

        if (!svixId || !svixTimestamp || !svixSignature) {
            return res.status(400).json({ error: 'Headers do webhook ausentes' });
        }

        const wh = new Webhook(webhookSecret);

        try {
            wh.verify(req.body, {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            });
        } catch (error) {
            console.error('Falha na verificação do webhook:', error);
            return res.status(400).json({ error: 'Assinatura inválida' });
        }

        let event: { type: string; data: any };

        try {
            event = JSON.parse(req.body.toString()) as { type: string; data: any };
        } catch (error) {
            console.error('Erro ao parsear payload:', error);
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const service = new ClerkWebhookService();

        try {
            switch (event.type) {
                case 'user.created':
                case 'user.updated':
                    await service.handleUserUpsert(event.data);
                    break;
                case 'user.deleted':
                    await service.handleUserDeleted(event.data.id);
                    break;
                default:
                    console.log(`Evento não tratado: ${event.type}`);
            }

            return res.status(200).json({ received: true });
        } catch (error) {
            console.error('Erro ao processar webhook:', error);
            return res.status(500).json({ error: 'Erro ao processar webhook' });
        }
    }
}