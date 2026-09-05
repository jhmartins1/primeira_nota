import { Router } from 'express';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

import { CreateAgendamentoController } from '../controllers/Agendamento/CreateAgendamentoController';

import { GetAgendamentosController } from '../controllers/Agendamento/GetAgendamentosController';

import { GetDisponibilidadeController } from '../controllers/Agendamento/GetDisponibilidadeController';

import { CancelarAgendamentoController } from '../controllers/Agendamento/CancelarAgendamentoController';

import { GetAgendamentosProfessorController } from '../controllers/Agendamento/GetAgendamentosProfessorController';

import { RemarcarAgendamentoController } from '../controllers/Agendamento/RemarcarAgendamentoController';

import { RemarcarAgendamentoProfessorController } from '../controllers/Agendamento/RemarcarAgendamentoProfessorController';

const agendamentoRoutes =
    Router();

// ----------------------------------------------------
// CONTROLLERS
// ----------------------------------------------------

const getAgendamentosProfessorController =
    new GetAgendamentosProfessorController();

const createAgendamentoController =
    new CreateAgendamentoController();

const getDisponibilidadeController =
    new GetDisponibilidadeController();

const getAgendamentosController =
    new GetAgendamentosController();

const cancelarAgendamentoController =
    new CancelarAgendamentoController();

const remarcarAgendamentoController =
    new RemarcarAgendamentoController();

const remarcarAgendamentoProfessorController =
    new RemarcarAgendamentoProfessorController();

// ----------------------------------------------------
// DISPONIBILIDADE
// ----------------------------------------------------

agendamentoRoutes.get(
    '/disponibilidade',
    clerkAuthMiddleware,
    (req, res) =>
        getDisponibilidadeController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// AGENDAMENTOS DO PROFESSOR
// ----------------------------------------------------

agendamentoRoutes.get(
    '/professor',
    clerkAuthMiddleware,
    (req, res) =>
        getAgendamentosProfessorController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// AGENDAMENTOS DO ALUNO
// ----------------------------------------------------

agendamentoRoutes.get(
    '/',
    clerkAuthMiddleware,
    (req, res) =>
        getAgendamentosController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// CRIAR AGENDAMENTO
// ----------------------------------------------------

agendamentoRoutes.post(
    '/',
    clerkAuthMiddleware,
    (req, res) =>
        createAgendamentoController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// REMARCAR AGENDAMENTO - ALUNO
// ----------------------------------------------------

agendamentoRoutes.patch(
    '/:id/remarcar',
    clerkAuthMiddleware,
    (req, res) =>
        remarcarAgendamentoController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// REMARCAR AGENDAMENTO - PROFESSOR
// ----------------------------------------------------

agendamentoRoutes.patch(
    '/:id/remarcar-professor',
    clerkAuthMiddleware,
    (req, res) =>
        remarcarAgendamentoProfessorController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// CANCELAR AGENDAMENTO
// ----------------------------------------------------

agendamentoRoutes.patch(
    '/:id/cancelar',
    clerkAuthMiddleware,
    (req, res) =>
        cancelarAgendamentoController.handle(
            req,
            res
        )
);

// ----------------------------------------------------
// EXPORT
// ----------------------------------------------------

export {
    agendamentoRoutes,
};