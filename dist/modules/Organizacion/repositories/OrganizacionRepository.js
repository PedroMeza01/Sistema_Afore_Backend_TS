"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizacionRepository = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const Organizacion_1 = __importDefault(require("../model/Organizacion"));
// AJUSTA el import a tu ruta real del model
exports.OrganizacionRepository = {
    getAll: async (includeInactivas = false) => {
        return await Organizacion_1.default.findAll({
            attributes: ['id_organizacion', 'nombre_organizacion', 'razon_social_organizacion', 'rfc_organizacion'],
            where: includeInactivas ? {} : { estatus_organizacion: true },
            order: [['createdAt', 'DESC']]
        });
    },
    getById: async (id_organizacion, options) => {
        return await Organizacion_1.default.findByPk(id_organizacion, {
            transaction: options?.transaction
        });
    },
    existsByRFC: async (rfc_organizacion, excludeId) => {
        if (!rfc_organizacion)
            return false;
        const where = { rfc_organizacion };
        if (excludeId)
            where.id_organizacion = { [sequelize_1.Op.ne]: excludeId };
        const count = await Organizacion_1.default.count({ where });
        return count > 0;
    },
    create: async (data, options) => {
        //console.log(data);
        return await Organizacion_1.default.create({
            id_organizacion: (0, uuid_1.v4)(),
            ...data
        }, {
            transaction: options?.transaction
        });
    },
    updateById: async (id_organizacion, data, options) => {
        await Organizacion_1.default.update(data, {
            where: { id_organizacion },
            transaction: options?.transaction
        });
        return await exports.OrganizacionRepository.getById(id_organizacion, options);
    },
    setStatus: async (id_organizacion, estatus_organizacion, options) => {
        return await Organizacion_1.default.update({ estatus_organizacion }, { where: { id_organizacion }, transaction: options?.transaction });
    }
};
//# sourceMappingURL=OrganizacionRepository.js.map