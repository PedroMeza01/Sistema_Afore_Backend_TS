// src/modules/Proceso/controllers/ProcesoController.ts
import { Request, Response } from 'express';
import { ProcesoService } from '../services/Proceso.service';
import { AuthedRequest } from '../../../middleware/auth';

const getOrg = (req: AuthedRequest) => {
  const orgFromToken = (req.user as any)?.id_organizacion;
  return orgFromToken ?? (req.body as any)?.id_organizacion ?? (req.query as any)?.id_organizacion;
};

export const ProcesoController = {
  list: async (req: any, res: Response) => {
    try {
      // AJUSTA: depende cómo guardas auth. Ej: req.user.id_organizacion
      const id_organizacion = req.user?.id_organizacion;
      if (!id_organizacion) {
        res.status(401).json({ message: 'No autorizado' });
      }

      const page = Math.max(Number(req.query.page || 1), 1);
      const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
      const search = (req.query.search || '').toString();
      const f = (req.query.f || '').toString();

      const data = await ProcesoService.list({ id_organizacion, page, limit, search, f });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ message: err?.message || 'Error en list procesos' });
    }
  },
  finalizarProceso: async (req: AuthedRequest, res: Response) => {
    try {
      const { id_cliente, id_proceso } = req.params;
      const id_organizacion = getOrg(req);

      if (!id_organizacion) {
        res.status(401).json({ ok: false, message: 'No autorizado: falta id_organizacion' });
      }

      if (!id_cliente || !id_proceso) {
        res.status(400).json({ ok: false, message: 'Faltan parámetros: id_cliente o id_proceso' });
      }

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
      //  console.log(error);
      res.status(500).json({
        ok: false,
        message: error?.message ?? 'Error al finalizar proceso'
      });
    }
  },

  replaceArchivo: async (req: AuthedRequest, res: Response) => {
    try {
      const { id_proceso_archivo } = req.params;
      const file = req.file as Express.Multer.File | undefined;
      const { categoria } = req.body as any;

      if (!id_proceso_archivo) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso_archivo' });
      }

      if (!file) {
        res.status(400).json({ ok: false, message: 'Falta file (field: file)' });
      }

      const updated = await ProcesoService.replaceArchivoSupabase({
        id_proceso_archivo,
        categoria: categoria ?? null,
        file
      });

      res.status(200).json({ ok: true, data: updated });
    } catch (err: any) {
      //  console.log(err);
      res.status(400).json({ ok: false, message: err?.message || 'Error al reemplazar archivo' });
    }
  },

  create: async (req: AuthedRequest, res: Response) => {
    try {
      const id_organizacion = getOrg(req);

      if (!id_organizacion) {
        res.status(401).json({ ok: false, message: 'No autorizado: falta id_organizacion' });
      }

      const row = await ProcesoService.create(req.body, id_organizacion);
      res.status(201).json({ ok: true, data: row });
    } catch (e: any) {
      res.status(400).json({ ok: false, message: e?.message || 'Error creando proceso' });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id_proceso } = req.params as any;

      if (!id_proceso) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso' });
      }

      const row = await ProcesoService.getById(id_proceso);

      if (!row) {
        res.status(404).json({ ok: false, message: 'No encontrado' });
      }

      res.json({ ok: true, row });
    } catch (e: any) {
      res.status(500).json({ ok: false, message: e?.message || 'Error' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id_proceso } = req.params as any;

      if (!id_proceso) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso' });
      }

      const row = await ProcesoService.update(id_proceso, req.body);

      if (!row) {
        res.status(404).json({ ok: false, message: 'No encontrado' });
      }

      res.json({ ok: true, data: row });
    } catch (e: any) {
      res.status(400).json({ ok: false, message: e?.message || 'Error actualizando' });
    }
  },

  listByCliente: async (req: Request, res: Response) => {
    try {
      const { id_cliente } = req.params as any;

      if (!id_cliente) {
        res.status(400).json({ ok: false, message: 'Falta id_cliente' });
      }

      const rows = await ProcesoService.listByCliente(id_cliente);

      res.json({ ok: true, data: rows });
    } catch (e: any) {
      res.status(500).json({ ok: false, message: e?.message || 'Error listando' });
    }
  },

  uploadArchivo: async (req: Request, res: Response) => {
    try {
      const { id_proceso } = req.params as any;
      const { categoria, notas } = req.body as any;
      const file = (req as any).file as Express.Multer.File | undefined;

      if (!id_proceso) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso' });
      }

      if (!file) {
        res.status(400).json({ ok: false, message: 'Archivo requerido (field: file)' });
      }

      if (!categoria) {
        res.status(400).json({ ok: false, message: 'categoria requerida' });
      }

      const archivo = await ProcesoService.uploadArchivo(
        {
          id_proceso,
          categoria,
          notas: notas ?? null
        },
        file
      );

      res.status(201).json({ ok: true, data: archivo });
    } catch (error: any) {
      // console.log(error);
      res.status(400).json({
        ok: false,
        message: error?.message || 'Error subiendo archivo'
      });
    }
  },

  listArchivos: async (req: Request, res: Response) => {
    try {
      const { id_proceso } = req.params as any;

      if (!id_proceso) {
        res.status(400).json({ ok: false, message: 'Falta id_proceso' });
      }

      const rows = await ProcesoService.listArchivos(id_proceso);
      res.json({ ok: true, data: rows });
    } catch (e: any) {
      res.status(500).json({ ok: false, message: e?.message || 'Error listando archivos' });
    }
  }
};
