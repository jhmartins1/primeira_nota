import { Router } from 'express';
import { GetAllNivelController } from '../controllers/Nivel/GetAllNivelController';

const NivelRouter = Router();
const getAllNivelController = new GetAllNivelController();

NivelRouter.get('/', getAllNivelController.handle);

export { NivelRouter };