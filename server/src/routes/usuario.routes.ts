import { Router } from 'express';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import { GetOneUsuarioController } from '../controllers/Usuario/GetOneUsuarioController';
import { UpdateUsuarioController } from '../controllers/Usuario/UpdateUsuarioController';
import { SaveUsuarioInstrumentosController } from '../controllers/Usuario/SaveUsuarioInstrumentosController';

const userRoute = Router();

const getOneUsuarioController =
    new GetOneUsuarioController();

const updateUsuarioController =
    new UpdateUsuarioController();

const saveUsuarioInstrumentosController =
    new SaveUsuarioInstrumentosController();

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

// ========================================
// SALVAR INSTRUMENTOS DO USUÁRIO AUTENTICADO
// ========================================
userRoute.post(
    '/instrumentos',
    clerkAuthMiddleware,
    (req, res) =>
        saveUsuarioInstrumentosController.handle(req, res)
);


export { userRoute };