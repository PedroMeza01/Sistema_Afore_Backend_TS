import { Request, Response } from 'express';
import { ClientesServices } from '../services/Clientes.services';
import { AuthedRequest } from '../../../middleware/auth';
const getOrg = (req: AuthedRequest) => {
  // Ideal: req.user?.id_organizacion
  const orgFromToken = (req.user as any)?.id_organizacion;

  return orgFromToken ?? req.body?.id_organizacion;
};
export class ClientesController {
  static getAll = async (req: AuthedRequest, res: Response) => {
    try {
      //   const id_organizacion = req.user?.id_organizacion;
      // if (!id_organizacion) {
      //    return res.status(401).json({ mensaje: 'Token inválido: sin organización' });
      //    }

      const page = Math.max(parseInt(String(req.query.page ?? '1'), 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '10'), 10) || 10, 1), 100);
      const search = String(req.query.search ?? '').trim();

      const result = await ClientesServices.getAllPaginated({
        page,
        limit,
        search: search.length ? search : undefined
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ mensaje: error?.message || error });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cliente = await ClientesServices.getById(id);
      res.status(200).json(cliente);
    } catch (error: any) {
      res.status(404).json({ mensaje: error?.message || error });
    }
  };

  static create = async (req: AuthedRequest, res: Response) => {
    try {
      const id_organizacion = getOrg(req);

      const created = await ClientesServices.create(req.body, id_organizacion);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ mensaje: error?.message || error });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await ClientesServices.update(id, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ mensaje: error?.message || error });
    }
  };

  static toggleActivo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await ClientesServices.toggleActivo(id);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ mensaje: error?.message || error });
    }
  };
}
