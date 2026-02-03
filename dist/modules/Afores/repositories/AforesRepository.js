"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AforeRepository = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const Afores_1 = __importDefault(require("../model/Afores"));
exports.AforeRepository = {
    create: async (nombre_afore, tx) => {
        return await Afores_1.default.create({
            id_afore: (0, uuid_1.v4)(),
            nombre_afore
        }, { transaction: tx });
    },
    getAll: async () => {
        return await Afores_1.default.findAll();
    },
    findById: async (id_afore) => {
        return await Afores_1.default.findByPk(id_afore);
    },
    existsByNombre: async (nombre_afore, excludeId) => {
        const where = { nombre_afore: nombre_afore.trim() };
        if (excludeId)
            where.id_afore = { [sequelize_1.Op.ne]: excludeId };
        const count = await Afores_1.default.count({ where });
        return count > 0;
    },
    updateById: async (id_afore, nombre_afore, tx) => {
        const actualizado = Afores_1.default.update({ nombre_afore: nombre_afore.trim() }, { where: { id_afore }, transaction: tx });
        return actualizado;
    },
    cambiarStatusByID: async (id_afore, tx) => {
        const afore = await Afores_1.default.findByPk(id_afore, { transaction: tx });
        if (!afore)
            throw new Error('AFORE no encontrado');
        return afore.update({ activo_afore: !afore.activo_afore }, { transaction: tx });
    }
};
//# sourceMappingURL=AforesRepository.js.map