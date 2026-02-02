// src/modules/Proceso/controllers/ProcesoController.ts
import { Request, Response } from 'express';
import { ProcesoService } from '../services/Proceso.service';
import { AuthedRequest } from '../../../middleware/auth';

const getOrg = (req: AuthedRequest) => {
  // Ideal: req.user?.id_organizacion
  const orgFromToken = (req.user as any)?.id_organizacion;

  return orgFromToken ?? req.body?.id_organizacion;
};
export class ProcesoController {
  static finalizarProceso = async (req: AuthedRequest, res: Response) => {
    //console.log(req);
    const { id_cliente, id_proceso } = req.params;
    const id_organizacion = getOrg(req);
    try {
      const result = await ProcesoService.finalizarProcesoEnviarCorreoYBorrarTodo({
        id_cliente,
        id_proceso,
        id_organizacion
      });

      res.status(200).json({
        ok: true,
        message: 'Proceso finalizado, correo enviado y datos eliminados.',
        data: result
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: error?.message ?? 'Error al finalizar proceso'
      });
    }
  };
  static replaceArchivo = async (req: AuthedRequest, res: Response) => {
    try {
      const { id_proceso_archivo } = req.params;
      const file = req.file as Express.Multer.File | undefined;
      const { categoria } = req.body;

      if (!id_proceso_archivo) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso_archivo' });
      }
      if (!file) {
        res.status(400).json({ ok: false, message: 'Falta file' });
      }

      const updated = await ProcesoService.replaceArchivoSupabase({
        id_proceso_archivo,
        categoria: categoria ?? null,
        file
      });

      res.status(200).json({ ok: true, mensaje: updated });
    } catch (err: any) {
      console.log(err);
      res.status(400).json({ ok: false, message: err?.message || 'Error al reemplazar archivo' });
    }
  };

  static create = async (req: AuthedRequest, res: Response) => {
    try {
      //  console.log(req.body);
      const id_origanizacion = getOrg(req);
      const row = await ProcesoService.create(req.body, id_origanizacion);
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
      //console.log(req.params);
      const { id_proceso } = req.params;
      //console.log(id_proceso);
      const { categoria, notas } = req.body;

      const file = (req as any).file as Express.Multer.File | undefined;

      if (!file) {
        res.status(400).json({ message: 'Archivo requerido (field: file)' });
      }

      if (!categoria) {
        res.status(400).json({ message: 'categoria requerida' });
      }

      const archivo = await ProcesoService.uploadArchivo(
        {
          id_proceso,
          categoria,
          notas: notas ?? null
        },
        file
      );

      res.status(201).json(archivo);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error?.message || 'Error subiendo archivo'
      });
    }
  };

  static listArchivos = async (req: Request, res: Response) => {
    try {
      const rows = await ProcesoService.listArchivos(req.params.id_proceso);
      console.log(rows);
      res.json({ mensaje: rows });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || 'Error listando archivos' });
    }
  };
}
