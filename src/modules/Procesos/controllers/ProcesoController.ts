// src/modules/Proceso/controllers/ProcesoController.ts
import { Request, Response } from 'express';
import { ProcesoService } from '../services/Proceso.service';

export class ProcesoController {
  static create = async (req: Request, res: Response) => {
    try {
      //  console.log(req.body);
      const row = await ProcesoService.create(req.body);
      res.status(201).json({ mensaje: row });
    } catch (e: any) {
      res.status(400).json({ message: e?.message || 'Error creando proceso' });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const row = await ProcesoService.getById(req.params.id_proceso);
      if (!row) res.status(404).json({ message: 'No encontrado' });
      res.json({ mensaje: row });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || 'Error' });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const row = await ProcesoService.update(req.params.id_proceso, req.body);
      if (!row) res.status(404).json({ message: 'No encontrado' });
      res.json({ mensaje: row });
    } catch (e: any) {
      res.status(400).json({ message: e?.message || 'Error actualizando' });
    }
  };

  static listByCliente = async (req: Request, res: Response) => {
    try {
      const rows = await ProcesoService.listByCliente(req.params.id_cliente);
      res.json({ mensaje: rows });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || 'Error listando' });
    }
  };

  static uploadArchivo = async (req: Request, res: Response) => {
    try {
      const { id_proceso } = req.params;
      const { categoria, notas } = req.body;

      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) res.status(400).json({ message: 'Archivo requerido (field: file)' });
      if (!categoria) res.status(400).json({ message: 'categoria requerida' });

      const created = await ProcesoService.uploadArchivo({ id_proceso, categoria, notas: notas ?? null }, file);

      res.status(201).json({ mensaje: created });
    } catch (e: any) {
      res.status(400).json({ message: e?.message || 'Error subiendo archivo' });
    }
  };

  static listArchivos = async (req: Request, res: Response) => {
    try {
      const rows = await ProcesoService.listArchivos(req.params.id_proceso);
      res.json({ mensaje: rows });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || 'Error listando archivos' });
    }
  };
}
