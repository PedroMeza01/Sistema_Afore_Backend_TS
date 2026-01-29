// src/modules/Proceso/routes/proceso.routes.ts
import { Router } from 'express';
import { ProcesoController } from '../controllers/ProcesoController';
import { uploadProcesoArchivo } from '../../../middleware/uploadProcesoArchivo';

const router = Router();

// base: /api/procesos
router.post('/', ProcesoController.create);
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

export default router;
