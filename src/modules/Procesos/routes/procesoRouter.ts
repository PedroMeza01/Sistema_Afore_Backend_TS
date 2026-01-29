// src/modules/Proceso/routes/proceso.routes.ts
import { Router } from 'express';
import { ProcesoController } from '../controllers/ProcesoController';
import { uploadProcesoArchivo } from '../../../middleware/uploadProcesoArchivo';
import { authMiddleware } from '../../../middleware/auth';

const router = Router();

// base: /api/procesos
router.post('/', authMiddleware, ProcesoController.create);
router.get('/:id_proceso', ProcesoController.getById);
router.patch('/:id_proceso', ProcesoController.update);

// listados
router.get('/cliente/:id_cliente', ProcesoController.listByCliente);

// archivos
// multipart/form-data:
// - file: (archivo)
// - categoria: 'EVIDENCIA_COBRO' | 'BLOQUEO' | ...
// - notas: opcional
router.post('/:id_proceso/archivos', uploadProcesoArchivo.single('file'), ProcesoController.uploadArchivo);
router.get('/:id_proceso/archivos', ProcesoController.listArchivos);
router.put(
  '/archivos/:id_proceso_archivo',
  authMiddleware,
  uploadProcesoArchivo.single('file'),
  ProcesoController.replaceArchivo
);
export default router;
