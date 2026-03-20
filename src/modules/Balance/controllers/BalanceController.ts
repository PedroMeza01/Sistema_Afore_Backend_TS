// src/modules/Balance/controllers/BalanceController.ts
import { Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
import { BalanceService } from '../services/Balance.service';

const getOrg = (req: AuthedRequest): string =>
  req.user?.id_organizacion ??
  (req.body as any)?.id_organizacion ??
  (req.query as any)?.id_organizacion ??
  '';

export class BalanceController {
  // GET /api/balance?search=&asesor=&desde=&hasta=&page=1&limit=10
  static async getBalance(req: AuthedRequest, res: Response): Promise<void> {
    try {
      const id_organizacion = getOrg(req);

      const result = await BalanceService.getBalance({
        id_organizacion,
        search: (req.query.search as string)  || '',
        asesor: (req.query.asesor  as string)  || '',
        desde:  (req.query.desde   as string)  || '',
        hasta:  (req.query.hasta   as string)  || '',
        page:   Number(req.query.page)  || 1,
        limit:  Number(req.query.limit) || 10,
      });

      res.json(result);
    } catch (error: any) {
      console.error('[BalanceController]', error);
      res.status(400).json({ message: error.message || 'Error al obtener balance' });
    }
  }
}
