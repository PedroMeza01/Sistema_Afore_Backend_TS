import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardProcesos.service';
import { AuthedRequest } from '../../../middleware/auth';
const getOrg = (req: AuthedRequest) => {
  // Ideal: req.user?.id_organizacion
  const orgFromToken = (req.user as any)?.id_organizacion;
  return orgFromToken ?? req.body?.id_organizacion;
};
export class DashboardController {
  static getDashboard = async (req: AuthedRequest, res: Response) => {
    try {
      const id_organizacion = getOrg(req);
      if (!id_organizacion) res.status(400).json({ message: 'id_organizacion requerido' });

      const data = await DashboardService.getDashboard({ id_organizacion });
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  };
}
