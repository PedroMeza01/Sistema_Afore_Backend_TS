// src/modules/Balance/routes/balanceRouter.ts
import { Router } from 'express';
import { BalanceController } from '../controllers/BalanceController';
import { authMiddleware } from '../../../middleware/auth';

const router = Router();

// base: /api/balance
router.get('/', authMiddleware, BalanceController.getBalance);

export default router;
