"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesoRepository = void 0;
const Proceso_1 = __importDefault(require("../model/Proceso"));
const ProcesoArchivo_1 = __importDefault(require("../model/ProcesoArchivo"));
const Clientes_1 = __importDefault(require("../../Clientes/model/Clientes"));
const Organizacion_1 = __importDefault(require("../../Organizacion/model/Organizacion"));
const Afores_1 = __importDefault(require("../../Afores/model/Afores"));
const Asesor_1 = __importDefault(require("../../Asesores/model/Asesor"));
exports.ProcesoRepository = {
    // ===== Proceso =====
    create: async (data, id_organizacion) => {
        return await Proceso_1.default.create({ ...data, id_organizacion });
    },
    findById: async (id_proceso) => {
        return await Proceso_1.default.findByPk(id_proceso, { include: [ProcesoArchivo_1.default] });
    },
    update: async (id_proceso, data) => {
        const row = await Proceso_1.default.findByPk(id_proceso);
        if (!row)
            return null;
        await row.update({ ...data });
        return row;
    },
    listByCliente: async (id_cliente) => {
        return await Proceso_1.default.findAll({
            where: { id_cliente },
            order: [['createdAt', 'DESC']]
        });
    },
    // ===== Archivos =====
    findArchivoById: async (input) => {
        const where = { id_proceso_archivo: input.id_proceso_archivo };
        if (input.id_organizacion)
            where.id_organizacion = input.id_organizacion;
        return await ProcesoArchivo_1.default.findOne({ where });
    },
    createArchivo: async (data) => {
        return await ProcesoArchivo_1.default.create(data);
    },
    listArchivos: async (id_proceso) => {
        return await ProcesoArchivo_1.default.findAll({
            where: { id_proceso, activo: true },
            order: [['createdAt', 'DESC']]
        });
    },
    updateArchivo: async (input) => {
        const where = { id_proceso_archivo: input.id_proceso_archivo };
        if (input.id_organizacion)
            where.id_organizacion = input.id_organizacion;
        const [affected, rows] = await ProcesoArchivo_1.default.update({
            categoria: input.categoria,
            nombre_original: input.nombre_original,
            mime_type: input.mime_type,
            tamano_bytes: input.tamano_bytes,
            storage_provider: input.storage_provider,
            storage_bucket: input.storage_bucket,
            storage_path: input.storage_path,
            public_url: input.public_url,
            activo: input.activo
        }, { where, returning: true });
        if (affected === 0)
            return null;
        return rows?.[0] ?? null;
    },
    // ===== Cierre de proceso =====
    // 1) Snapshot para armar correo + descargar archivos + luego borrar todo
    getSnapshotParaCierre: async (input) => {
        const whereProceso = { id_proceso: input.id_proceso };
        if (input.id_cliente)
            whereProceso.id_cliente = input.id_cliente;
        if (input.id_organizacion)
            whereProceso.id_organizacion = input.id_organizacion;
        const proceso = await Proceso_1.default.findOne({
            where: whereProceso,
            include: [
                {
                    model: Clientes_1.default,
                    required: false
                },
                {
                    model: Organizacion_1.default,
                    attributes: ['nombre_organizacion', 'email_contacto_organizacion'], // solo nombre
                    required: false
                },
                {
                    model: Afores_1.default,
                    attributes: ['nombre_afore'], // solo nombre
                    required: false
                },
                {
                    model: Asesor_1.default,
                    attributes: ['nombre_asesor', 'apellido_pat_asesor', 'apellido_mat_asesor'], // solo nombre
                    required: false
                }
            ]
        });
        if (!proceso)
            return null;
        if (proceso.estatus_proceso === 'ACTIVO') {
            throw new Error('No se puede finalizar un proceso en estado ACTIVO');
        }
        const whereArchivos = { id_proceso: input.id_proceso, activo: true };
        const archivos = await ProcesoArchivo_1.default.findAll({
            where: whereArchivos,
            order: [['createdAt', 'DESC']]
        });
        return { proceso, archivos };
    },
    // 2) Borrar SOLO archivos (DB)
    deleteArchivosByProceso: async (input) => {
        const where = { id_proceso: input.id_proceso };
        return await ProcesoArchivo_1.default.destroy({
            where,
            transaction: input.transaction
        });
    },
    // 3) Borrar SOLO proceso (DB)
    deleteProceso: async (input) => {
        const where = { id_proceso: input.id_proceso };
        if (input.id_organizacion)
            where.id_organizacion = input.id_organizacion;
        return await Proceso_1.default.destroy({
            where,
            transaction: input.transaction
        });
    }
};
//# sourceMappingURL=ProcesoRepository.js.map