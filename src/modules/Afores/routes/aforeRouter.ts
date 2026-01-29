import { Router } from 'express';
import { AforeController } from '../controllers/AforesController';

const router = Router();

// base: /api/afores
router.post('/', AforeController.create);
router.get('/', AforeController.getAll);
router.get('/:id', AforeController.getById);
router.put('/:id', AforeController.update);
router.patch('/:id', AforeController.actualizarStatus);

export default router;
