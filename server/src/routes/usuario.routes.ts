import { Router } from 'express';

import { GetOneUsuarioController } from '../controllers/Usuario/GetOneUsuarioController';
import { UpdateUsuarioController } from '../controllers/Usuario/UpdateUsuarioController';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

const userRoute = Router();

const getOneUsuarioController =
    new GetOneUsuarioController();

const updateUsuarioController =
    new UpdateUsuarioController();


// ========================================
// GET USUÁRIO AUTENTICADO
// ========================================

userRoute.get(
    '/me',
    clerkAuthMiddleware,
    (req, res) =>
        getOneUsuarioController.handle(req, res)
);


// ========================================
// ATUALIZAR USUÁRIO AUTENTICADO
// ========================================

userRoute.patch(
    '/me',
    clerkAuthMiddleware,
    (req, res) =>
        updateUsuarioController.handle(req, res)
);


export { userRoute };