"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizacionController = void 0;
const Organizacion_service_1 = require("../services/Organizacion.service");
exports.OrganizacionController = {
    create: async (req, res) => {
        try {
            const data = await Organizacion_service_1.OrganizacionService.create(req.body);
            res.status(201).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error?.message || 'Error al crear organización',
                error: error?.message || error
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const includeInactivas = String(req.query.includeInactivas || 'false').toLowerCase() === 'true';
            const data = await Organizacion_service_1.OrganizacionService.getAll(includeInactivas);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error?.message || 'Error al obtener organizaciones',
                error: error?.message || error
            });
        }
    },
    getById: async (req, res) => {
        try {
            const data = await Organizacion_service_1.OrganizacionService.getById(req.params.id);
            res.status(200).json(data);
        }
        catch (error) {
            const msg = String(error?.message || '');
            const code = msg.toLowerCase().includes('no encontrada') ? 404 : 500;
            res.status(code).json({
                message: msg || 'Error al obtener organización',
                error: error?.message || error
            });
        }
    }
    /*  update: async (req: Request, res: Response) => {
      try {
        const data = await OrganizacionService.update(req.params.id, req.body);
        res.status(200).json(data);
      } catch (error: any) {
        const msg = String(error?.message || '');
        const code = msg.toLowerCase().includes('no encontrada')
          ? 404
          : msg.toLowerCase().includes('ya existe')
            ? 409
            : 500;
  
        res.status(code).json({
          message: msg || 'Error al actualizar organización',
          error: error?.message || error
        });
      }
    },
  
    activar: async (req: Request, res: Response) => {
      try {
        const data = await OrganizacionService.activar(req.params.id);
        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({
          message: error?.message || 'Error al activar organización',
          error: error?.message || error
        });
      }
    },
  
    desactivar: async (req: Request, res: Response) => {
      try {
        const data = await OrganizacionService.desactivar(req.params.id);
        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({
          message: error?.message || 'Error al desactivar organización',
          error: error?.message || error
        });
      }
    }*/
};
//# sourceMappingURL=OrganizacionController.js.map