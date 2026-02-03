"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsesorController = void 0;
const Asesor_service_1 = require("../services/Asesor.service");
const getOrg = (req) => {
    // Ideal: req.user?.id_organizacion
    const orgFromToken = req.user?.id_organizacion;
    return orgFromToken ?? req.body?.id_organizacion;
};
class AsesorController {
    static async create(req, res) {
        try {
            const id_organizacion = getOrg(req);
            const row = await Asesor_service_1.AsesorService.create(req.body, id_organizacion);
            res.status(201).json(row);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Error al crear asesor' });
        }
    }
    static async getAll(req, res) {
        try {
            const id_organizacion = getOrg(req);
            const rows = await Asesor_service_1.AsesorService.getAll(id_organizacion);
            res.json(rows);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Error al obtener asesores' });
        }
    }
    static async getById(req, res) {
        try {
            const id_organizacion = getOrg(req);
            const { id } = req.params;
            const row = await Asesor_service_1.AsesorService.getById(id, id_organizacion);
            res.json(row);
        }
        catch (error) {
            res.status(404).json({ message: error.message || 'No encontrado' });
        }
    }
    static async update(req, res) {
        try {
            const id_organizacion = getOrg(req);
            const { id } = req.params;
            const row = await Asesor_service_1.AsesorService.updateById(id, id_organizacion, req.body);
            res.json(row);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Error al actualizar' });
        }
    }
    static async toggleActivo(req, res) {
        try {
            const id_organizacion = getOrg(req);
            const { id } = req.params;
            const row = await Asesor_service_1.AsesorService.toggleActivo(id, id_organizacion);
            res.json(row);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Error al cambiar estatus' });
        }
    }
}
exports.AsesorController = AsesorController;
//# sourceMappingURL=AsesorController.js.map