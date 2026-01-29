import { Router } from 'express';
import { ClientesController } from '../controllers/ClientesController';

const router = Router();

// base: /api/clientes
router.get('/', ClientesController.getAll);
router.get('/:id', ClientesController.getById);
router.post('/', ClientesController.create);
router.put('/:id', ClientesController.update);
router.patch('/:id/toggle', ClientesController.toggleActivo);

export default router;
