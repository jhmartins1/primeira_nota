import express from 'express';
import testRoute from './utils/test.routes';
import { instrumentRoutes } from './routes/instrument.routes';
import { professorRoutes } from './routes/professor.routes';
import { NivelRouter } from './routes/nivel.routes';
import { userRoute } from './routes/usuario.routes';
import { agendamentoRoutes } from './routes/agentamento.routes';
import { ClerkWebhookController } from './controllers/Usuario/ClerkWebhookController';

const app = express();

const clerkWebhookController =
    new ClerkWebhookController();

// WEBHOOK DO CLERK
app.post(
    '/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    (req, res) =>
        clerkWebhookController.handle(req, res)
);

// JSON
app.use(express.json());

// ROTAS
app.use('/test', testRoute);

app.use('/instrument', instrumentRoutes);

app.use('/professor', professorRoutes);

app.use('/nivel', NivelRouter);

app.use('/usuario', userRoute);

app.use('/agendamento', agendamentoRoutes);

// SERVER
const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Server is running on http://127.0.0.1:${PORT} 🚀`
    );
});