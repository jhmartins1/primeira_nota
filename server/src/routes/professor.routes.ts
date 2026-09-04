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

import { GetDisponibilidadeProfessorController } from '../controllers/Disponibilidade/GetDisponibilidadeProfessorController';
import { CreateDisponibilidadeController } from '../controllers/Disponibilidade/CreateDisponibilidadeController';
import { DeleteDisponibilidadeController } from '../controllers/Disponibilidade/DeleteDisponibilidadeController';
import { DeleteDisponibilidadesDiaController } from '../controllers/Disponibilidade/DeleteDisponibilidadesDiaController';
import { GetDisponibilidadeController } from '../controllers/Disponibilidade/GetDisponibilidadeController';

const professorRoutes = Router();

// CONTROLLERS
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

const getDisponibilidadeProfessorController =
    new GetDisponibilidadeProfessorController();

const createDisponibilidadeController =
    new CreateDisponibilidadeController();

const deleteDisponibilidadeController =
    new DeleteDisponibilidadeController();

const deleteDisponibilidadesDiaController =
    new DeleteDisponibilidadesDiaController();

const getDisponibilidadeController =
    new GetDisponibilidadeController();

// ROTAS DO PROFESSOR AUTENTICADO
professorRoutes.get(
    '/me',
    clerkAuthMiddleware,
    (req, res) =>
        getOneProfessorMeController.handle(
            req,
            res
        )
);

professorRoutes.post(
    '/instrumentos',
    clerkAuthMiddleware,
    (req, res) =>
        saveProfessorInstrumentosController.handle(
            req,
            res
        )
);

professorRoutes.post(
    '/vincular-conta',
    clerkIdentifyOnly,
    (req, res) =>
        vincularContaProfessorController.handle(
            req,
            res
        )
);

// ROTAS DE DISPONIBILIDADE
professorRoutes.get(
    '/disponibilidade',
    clerkAuthMiddleware,
    (req, res) =>
        getDisponibilidadeProfessorController.handle(
            req,
            res
        )
);

// Cria um ou vários horários.
professorRoutes.post(
    '/disponibilidade',
    clerkAuthMiddleware,
    (req, res) =>
        createDisponibilidadeController.handle(
            req,
            res
        )
);

professorRoutes.delete(
    '/disponibilidade/dia/:data',
    clerkAuthMiddleware,
    (req, res) =>
        deleteDisponibilidadesDiaController.handle(
            req,
            res
        )
);

professorRoutes.delete(
    '/disponibilidade/:id',
    clerkAuthMiddleware,
    (req, res) =>
        deleteDisponibilidadeController.handle(
            req,
            res
        )
);

// ROTAS GERAIS
professorRoutes.get(
    '/',
    getAllProfessorController.handle
);

professorRoutes.post(
    '/',
    createProfessorController.handle
);

// ROTAS POR ID
professorRoutes.get(
    '/:id/disponibilidade',
    (req, res) =>
        getDisponibilidadeController.handle(
            req,
            res
        )
);

professorRoutes.get(
    '/:id',
    getOneProfessorController.handle
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