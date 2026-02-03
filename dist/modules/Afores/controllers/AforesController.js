"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AforeController = void 0;
const Afores_service_1 = require("../services/Afores.service");
class AforeController {
    static create = async (req, res) => {
        try {
            const data = await Afores_service_1.AforeService.create(req.body);
            res.status(201).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    static getAll = async (req, res) => {
        try {
            const data = await Afores_service_1.AforeService.getAll();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener AFORES' });
        }
    };
    static getById = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Afores_service_1.AforeService.getById(id);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ message: 'Error al obtener AFORE' });
        }
    };
    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Afores_service_1.AforeService.update(id, req.body);
            res.json({ mensaje: 'Listo, Actualizado' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    static actualizarStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Afores_service_1.AforeService.actualizarStatus(id);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}
exports.AforeController = AforeController;
//# sourceMappingURL=AforesController.js.map