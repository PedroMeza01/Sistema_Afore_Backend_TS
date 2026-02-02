import { Router } from 'express';
import organizacionRouter from '../modules/Organizacion/routes/organizacionRouter';
import ClientesRouter from '../modules/Clientes/routes/clientesRouter';
import usuarioRouter from '../modules/Usuarios/routes/AuthRouter';
import aforesRoutes from '../modules/Afores/routes/aforeRouter';
import asesoresRoutes from '../modules/Asesores/routes/asesorRouter';
import { authMiddleware } from '../middleware/auth';
import routerProcesos from '../modules/Procesos/routes/procesoRouter';
const router = Router();

router.use('/organizacion', organizacionRouter);
router.use('/usuarios', usuarioRouter);
router.use('/clientes', authMiddleware, ClientesRouter);
router.use('/afores', authMiddleware, aforesRoutes);
router.use('/asesores', authMiddleware, asesoresRoutes);
router.use('/procesos', routerProcesos);
export default router;
