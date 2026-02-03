"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesRepository = void 0;
const Clientes_1 = __importDefault(require("../model/Clientes"));
const Organizacion_1 = __importDefault(require("../../Organizacion/model/Organizacion"));
const Asesor_1 = __importDefault(require("../../Asesores/model/Asesor"));
const sequelize_1 = require("sequelize");
exports.ClientesRepository = {
    borrarCliente: async (input) => {
        const { id_cliente, transaction } = input;
        const deleted = await Clientes_1.default.destroy({
            where: { id_cliente },
            transaction
        });
        if (deleted === 0) {
            throw new Error(`Cliente no encontrado o ya eliminado. id_cliente=${id_cliente}`);
        }
        return deleted;
    },
    getAllPaginated: async ({ /*id_organizacion, */ page, limit, search }) => {
        const offset = (page - 1) * limit;
        const where = {
        /*id_organizacion**/
        };
        if (search && search.trim().length) {
            const q = search.trim();
            where[sequelize_1.Op.or] = [
                { nombre_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { apellido_pat_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { apellido_mat_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { curp_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { rfc_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { nss_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { telefono_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { email_cliente: { [sequelize_1.Op.iLike]: `%${q}%` } }
            ];
        }
        const { rows, count } = await Clientes_1.default.findAndCountAll({
            where,
            include: [
                { model: Organizacion_1.default, required: false },
                { model: Asesor_1.default, required: false }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });
        // count puede venir como number o array en algunos escenarios
        const totalItems = Array.isArray(count) ? count.length : count;
        const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
        return {
            items: rows,
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                search: search ?? ''
            }
        };
    },
    getById: async (id_cliente) => {
        return await Clientes_1.default.findByPk(id_cliente, {
            include: [
                { model: Organizacion_1.default, required: false },
                { model: Asesor_1.default, required: false }
            ]
        });
    },
    create: async (data) => {
        return await Clientes_1.default.create({
            id_organizacion: data.id_organizacion,
            id_asesor: data.id_asesor,
            nombre_cliente: data.nombre_cliente?.trim(),
            apellido_pat_cliente: data.apellido_pat_cliente?.trim(),
            apellido_mat_cliente: data.apellido_mat_cliente?.trim(),
            curp_cliente: data.curp_cliente?.trim(),
            nss_cliente: data.nss_cliente?.trim(),
            rfc_cliente: data.rfc_cliente?.trim(),
            telefono_cliente: data.telefono_cliente?.trim(),
            email_cliente: data.email_cliente?.trim(),
            observaciones: (data.observaciones ?? '').trim(),
            activo: data.activo ?? true
        });
    },
    update: async (id_cliente, data) => {
        const payload = {};
        if (data.id_asesor !== undefined)
            payload.id_asesor = data.id_asesor;
        if (data.nombre_cliente !== undefined)
            payload.nombre_cliente = data.nombre_cliente.trim();
        if (data.apellido_pat_cliente !== undefined)
            payload.apellido_pat_cliente = data.apellido_pat_cliente.trim();
        if (data.apellido_mat_cliente !== undefined)
            payload.apellido_mat_cliente = data.apellido_mat_cliente.trim();
        if (data.curp_cliente !== undefined)
            payload.curp_cliente = data.curp_cliente.trim();
        if (data.nss_cliente !== undefined)
            payload.nss_cliente = data.nss_cliente.trim();
        if (data.rfc_cliente !== undefined)
            payload.rfc_cliente = data.rfc_cliente.trim();
        if (data.telefono_cliente !== undefined)
            payload.telefono_cliente = data.telefono_cliente.trim();
        if (data.email_cliente !== undefined)
            payload.email_cliente = data.email_cliente.trim();
        if (data.observaciones !== undefined)
            payload.observaciones = (data.observaciones ?? '').trim();
        if (data.activo !== undefined)
            payload.activo = Boolean(data.activo);
        await Clientes_1.default.update(payload, { where: { id_cliente } });
        return await exports.ClientesRepository.getById(id_cliente);
    },
    toggleActivo: async (id_cliente) => {
        const cliente = await Clientes_1.default.findByPk(id_cliente);
        if (!cliente)
            return null;
        cliente.activo = !Boolean(cliente.activo);
        await cliente.save();
        return await exports.ClientesRepository.getById(id_cliente);
    }
};
//# sourceMappingURL=ClientesRepository.js.map