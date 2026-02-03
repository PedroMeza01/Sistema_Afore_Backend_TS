"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsesorRepository = void 0;
const Asesor_1 = __importDefault(require("../model/Asesor"));
const uuid_1 = require("uuid");
exports.AsesorRepository = {
    create: async (data, tx) => {
        return Asesor_1.default.create({
            id_asesor: (0, uuid_1.v4)(),
            ...data
        }, { transaction: tx });
    },
    findAllByOrganizacion: async (id_organizacion) => {
        return Asesor_1.default.findAll({
            where: { id_organizacion },
            order: [['createdAt', 'DESC']]
        });
    },
    findByIdScoped: async (id_asesor, id_organizacion) => {
        return Asesor_1.default.findOne({ where: { id_asesor, id_organizacion } });
    },
    updateByIdScopedReturning: async (id_asesor, id_organizacion, data, tx) => {
        const [count, rows] = await Asesor_1.default.update(data, {
            where: { id_asesor, id_organizacion },
            returning: true, // Postgres
            transaction: tx
        });
        return { count, row: rows?.[0] ?? null };
    },
    toggleActivoScopedReturning: async (id_asesor, id_organizacion, tx) => {
        const [count, rows] = await Asesor_1.default.update(
        // NOT activo (atómico)
        { activo: Asesor_1.default.sequelize.literal('NOT activo') }, { where: { id_asesor, id_organizacion }, returning: true, transaction: tx });
        return { count, row: rows?.[0] ?? null };
    }
};
//# sourceMappingURL=AsesorRepository.js.map