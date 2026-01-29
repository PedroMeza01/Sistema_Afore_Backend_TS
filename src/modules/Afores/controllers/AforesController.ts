import { Request, Response } from 'express';
import { AforeService } from '../services/Afores.service';
import { AuthedRequest } from '../../../middleware/auth';

export class AforeController {
  static create = async (req: AuthedRequest, res: Response) => {
    try {
      const data = await AforeService.create(req.body);
      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  static getAll = async (req: AuthedRequest, res: Response) => {
    try {
      const data = await AforeService.getAll();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener AFORES' });
    }
  };

  static getById = async (req: AuthedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = await AforeService.getById(id);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: 'Error al obtener AFORE' });
    }
  };

  static update = async (req: AuthedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = await AforeService.update(id, req.body);
      res.json({ mensaje: 'Listo, Actualizado' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  static actualizarStatus = async (req: AuthedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = await AforeService.actualizarStatus(id);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
