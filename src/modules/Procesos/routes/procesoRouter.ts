// src/modules/Proceso/routes/proceso.routes.ts
import { Router } from 'express';
import { ProcesoController } from '../controllers/ProcesoController';
import { uploadProcesoArchivo } from '../../../middleware/uploadProcesoArchivo';
import { authMiddleware } from '../../../middleware/auth';

const router = Router();

// base: /api/procesos

// ====== LISTADOS ESPECÍFICOS (VAN PRIMERO) ======
router.get('/cliente/:id_cliente', authMiddleware, ProcesoController.listByCliente);
router.delete('/finalizar/:id_cliente/:id_proceso', authMiddleware, ProcesoController.finalizarProceso);

// ====== ARCHIVOS ======
router.post(
  '/:id_proceso/archivos',
  authMiddleware,
  uploadProcesoArchivo.single('file'),
  ProcesoController.uploadArchivo
);
router.get('/:id_proceso/archivos', authMiddleware, ProcesoController.listArchivos);

router.put(
  '/archivos/:id_proceso_archivo',
  authMiddleware,
  uploadProcesoArchivo.single('file'),
  ProcesoController.replaceArchivo
);

// ====== CRUD PRINCIPAL ======
router.post('/', authMiddleware, ProcesoController.create);
router.get('/', authMiddleware, ProcesoController.list);

// ojo: estas rutas “comodín” VAN AL FINAL
router.get('/:id_proceso', authMiddleware, ProcesoController.getById);
router.patch('/:id_proceso', authMiddleware, ProcesoController.update);

export default router;
