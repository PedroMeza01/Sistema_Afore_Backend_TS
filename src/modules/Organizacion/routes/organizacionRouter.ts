import { Router } from 'express';
import { OrganizacionController } from '../controllers/OrganizacionController';

const router = Router();

// base: /api/organizaciones
router.get('/', OrganizacionController.getAll);
router.post('/', OrganizacionController.create);
router.get('/:id', OrganizacionController.getById);
//router.put('/:id', OrganizacionController.update);

//router.patch('/:id/activar', OrganizacionController.activar);
//router.patch('/:id/desactivar', OrganizacionController.desactivar);

export default router;
