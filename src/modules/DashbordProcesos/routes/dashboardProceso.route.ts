import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardProcesosController';
import { authMiddleware } from '../../../middleware/auth';
const router = Router();
router.get('/', authMiddleware, DashboardController.getDashboard);

export default router;
