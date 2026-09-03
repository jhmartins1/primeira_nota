import { Router } from 'express';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import { clerkIdentifyOnly } from '../middlewares/clerkIdentifyOnly';

import { GetAllProfessorController } from '../controllers/Professor/GetAllProfessorController';
import { GetOneProfessorController } from '../controllers/Professor/GetOneProfessorController';
import { CreateProfessorController } from '../controllers/Professor/CreateProfessorController';
import { UpdateProfessorController } from '../controllers/Professor/UpdateProfessorController';
import { DeleteProfessorController } from '../controllers/Professor/DeleteProfessorController';
import { GetOneProfessorMeController } from '../controllers/Professor/GetOneProfessorMeController';
import { VincularContaProfessorController } from '../controllers/Professor/VincularContaProfessorController';
import { SaveProfessorInstrumentosController } from '../controllers/Professor/SaveProfessorInstrumentosController';

const professorRoutes = Router();

const getAllProfessorController =
    new GetAllProfessorController();

const getOneProfessorController =
    new GetOneProfessorController();

const createProfessorController =
    new CreateProfessorController();

const updateProfessorController =
    new UpdateProfessorController();

const deleteProfessorController =
    new DeleteProfessorController();

const getOneProfessorMeController =
    new GetOneProfessorMeController();

const vincularContaProfessorController =
    new VincularContaProfessorController();

const saveProfessorInstrumentosController =
    new SaveProfessorInstrumentosController();

// Rotas do professor autenticado
professorRoutes.get('/me', clerkAuthMiddleware, (req, res) =>
    getOneProfessorMeController.handle(req, res)
);

professorRoutes.post(
    '/instrumentos',
    clerkAuthMiddleware,
    (req, res) =>
        saveProfessorInstrumentosController.handle(req, res)
);

professorRoutes.post(
    '/vincular-conta',
    clerkIdentifyOnly,
    (req, res) =>
        vincularContaProfessorController.handle(req, res)
);

// Rotas gerais
professorRoutes.get(
    '/',
    getAllProfessorController.handle
);

professorRoutes.get(
    '/:id',
    getOneProfessorController.handle
);

professorRoutes.post(
    '/',
    createProfessorController.handle
);

professorRoutes.put(
    '/:id',
    updateProfessorController.handle
);

professorRoutes.delete(
    '/:id',
    deleteProfessorController.handle
);

export { professorRoutes };