"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesController = void 0;
const Clientes_services_1 = require("../services/Clientes.services");
const getOrg = (req) => {
    // Ideal: req.user?.id_organizacion
    const orgFromToken = req.user?.id_organizacion;
    return orgFromToken ?? req.body?.id_organizacion;
};
class ClientesController {
    static getAll = async (req, res) => {
        try {
            //   const id_organizacion = req.user?.id_organizacion;
            // if (!id_organizacion) {
            //    return res.status(401).json({ mensaje: 'Token inválido: sin organización' });
            //    }
            const page = Math.max(parseInt(String(req.query.page ?? '1'), 10) || 1, 1);
            const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '10'), 10) || 10, 1), 100);
            const search = String(req.query.search ?? '').trim();
            const result = await Clientes_services_1.ClientesServices.getAllPaginated({
                page,
                limit,
                search: search.length ? search : undefined
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ mensaje: error?.message || error });
        }
    };
    static getById = async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await Clientes_services_1.ClientesServices.getById(id);
            res.status(200).json(cliente);
        }
        catch (error) {
            res.status(404).json({ mensaje: error?.message || error });
        }
    };
    static create = async (req, res) => {
        try {
            const id_organizacion = getOrg(req);
            const created = await Clientes_services_1.ClientesServices.create(req.body, id_organizacion);
            res.status(201).json(created);
        }
        catch (error) {
            res.status(400).json({ mensaje: error?.message || error });
        }
    };
    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await Clientes_services_1.ClientesServices.update(id, req.body);
            res.status(200).json(updated);
        }
        catch (error) {
            res.status(400).json({ mensaje: error?.message || error });
        }
    };
    static toggleActivo = async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await Clientes_services_1.ClientesServices.toggleActivo(id);
            res.status(200).json(updated);
        }
        catch (error) {
            res.status(400).json({ mensaje: error?.message || error });
        }
    };
}
exports.ClientesController = ClientesController;
//# sourceMappingURL=ClientesController.js.map