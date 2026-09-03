import { Router } from 'express';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import { GetMinhaContaController } from '../controllers/Conta/GetMinhaContaController';

const contaRoute = Router();

const getMinhaContaController = new GetMinhaContaController();

contaRoute.get(
    '/me',
    clerkAuthMiddleware,
    (req, res) => getMinhaContaController.handle(req, res)
);

export { contaRoute };