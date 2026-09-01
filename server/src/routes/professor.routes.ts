import { Router } from 'express';
import { GetAllProfessorController } from '../controllers/Professor/GetAllProfessorController';
import { GetOneProfessorController } from '../controllers/Professor/GetOneProfessorController';
import { CreateProfessorController } from "../controllers/Professor/CreateProfessorController";
import { UpdateProfessorController } from "../controllers/Professor/UpdateProfessorController";
import { DeleteProfessorController } from "../controllers/Professor/DeleteProfessorController";

const professorRoutes = Router();

const getAllProfessorController = new GetAllProfessorController();
const getOneProfessorController = new GetOneProfessorController();
const createProfessorController = new CreateProfessorController();
const updateProfessorController = new UpdateProfessorController();
const deleteProfessorController = new DeleteProfessorController();

professorRoutes.get('/', getAllProfessorController.handle);
professorRoutes.get('/:id', getOneProfessorController.handle);
professorRoutes.post('/', createProfessorController.handle);
professorRoutes.put('/:id', updateProfessorController.handle);
professorRoutes.delete('/:id', deleteProfessorController.handle);

export { professorRoutes };