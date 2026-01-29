// src/modules/Asesores/controllers/AsesorController.ts
import { Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
import { AsesorService } from '../services/Asesor.service';

const getOrg = (req: AuthedRequest) => {
  // Ideal: req.user?.id_organizacion
  const orgFromToken = (req.user as any)?.id_organizacion;
  return orgFromToken ?? req.body?.id_organizacion;
};

export class AsesorController {
  static async create(req: AuthedRequest, res: Response) {
    try {
      const id_organizacion = getOrg(req);
      const row = await AsesorService.create(req.body, id_organizacion);
      res.status(201).json(row);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al crear asesor' });
    }
  }

  static async getAll(req: AuthedRequest, res: Response) {
    try {
      const id_organizacion = getOrg(req);

      const rows = await AsesorService.getAll(id_organizacion);
      res.json(rows);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al obtener asesores' });
    }
  }

  static async getById(req: AuthedRequest, res: Response) {
    try {
      const id_organizacion = getOrg(req);
      const { id } = req.params;
      const row = await AsesorService.getById(id, id_organizacion);
      res.json(row);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'No encontrado' });
    }
  }

  static async update(req: AuthedRequest, res: Response) {
    try {
      const id_organizacion = getOrg(req);
      const { id } = req.params;
      const row = await AsesorService.updateById(id, id_organizacion, req.body);
      res.json(row);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al actualizar' });
    }
  }

  static async toggleActivo(req: AuthedRequest, res: Response) {
    try {
      const id_organizacion = getOrg(req);
      const { id } = req.params;
      const row = await AsesorService.toggleActivo(id, id_organizacion);
      res.json(row);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al cambiar estatus' });
    }
  }
}
