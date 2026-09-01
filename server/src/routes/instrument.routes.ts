import { Router } from 'express';
import { GetAllInstrumentController } from '../controllers/Instrument/GetAllInstrumentController';
import { CreateInstrumentController } from '../controllers/Instrument/CreateInstrumentController';
import { GetOneInstrumentController } from '../controllers/Instrument/GetOneInstrumentController';
import { UpdateInstrumentController } from '../controllers/Instrument/UpdateInstrumentController';
import { DeleteInstrumentController } from '../controllers/Instrument/DeleteInstrumentController';

const instrumentRoutes = Router();

const getAllInstrumentController = new GetAllInstrumentController();
const createInstrumentController = new CreateInstrumentController();
const getOneInstrumentController = new GetOneInstrumentController();
const updateInstrumentController = new UpdateInstrumentController();
const deleteInstrumentController = new DeleteInstrumentController();

instrumentRoutes.get('/', getAllInstrumentController.handle);
instrumentRoutes.get('/:id', getOneInstrumentController.handle);
instrumentRoutes.post('/', createInstrumentController.handle);
instrumentRoutes.put('/:id', updateInstrumentController.handle);
instrumentRoutes.delete('/:id', deleteInstrumentController.handle);

export { instrumentRoutes };