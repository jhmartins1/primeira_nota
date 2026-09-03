import { Router } from 'express';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

import { CreateAgendamentoController } from '../controllers/Agendamento/CreateAgendamentoController';
import { GetAgendamentosController } from '../controllers/Agendamento/GetAgendamentosController';
import { GetDisponibilidadeController } from '../controllers/Agendamento/GetDisponibilidadeController';
import { CancelarAgendamentoController } from '../controllers/Agendamento/CancelarAgendamentoController';
import { GetAgendamentosProfessorController } from '../controllers/Agendamento/GetAgendamentosProfessorController';

const agendamentoRoutes = Router();

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

// Buscar horários disponíveis
agendamentoRoutes.get(
    '/disponibilidade',
    clerkAuthMiddleware,
    (req, res) =>
        getDisponibilidadeController.handle(req, res)
);

// Buscar agendamentos do professor logado
agendamentoRoutes.get(
    '/professor',
    clerkAuthMiddleware,
    (req, res) => getAgendamentosProfessorController.handle(req, res)
);


// Buscar agendamentos
agendamentoRoutes.get(
    '/',
    clerkAuthMiddleware,
    (req, res) =>
        getAgendamentosController.handle(req, res)
);

// Criar agendamento
agendamentoRoutes.post(
    '/',
    clerkAuthMiddleware,
    (req, res) =>
        createAgendamentoController.handle(req, res)
);

// Cancelar agendamento
agendamentoRoutes.patch(
    '/:id/cancelar',
    clerkAuthMiddleware,
    (req, res) =>
        cancelarAgendamentoController.handle(req, res)
);

export { agendamentoRoutes };