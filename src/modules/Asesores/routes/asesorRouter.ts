// src/modules/Asesores/routes/asesores.routes.ts
import { Router } from 'express';
import { AsesorController } from '../controllers/AsesorController';

const router = Router();

// base: /api/asesores
router.post('/', AsesorController.create);
router.get('/', AsesorController.getAll);
router.get('/:id', AsesorController.getById);
router.put('/:id', AsesorController.update);
router.patch('/:id/toggle', AsesorController.toggleActivo);

export default router;
