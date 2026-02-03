"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsesorService = void 0;
const AsesorRepository_1 = require("../repositories/AsesorRepository");
const cleanStr = (v) => (v ?? '').trim();
class AsesorService {
    static async create(data, id_organizacion, tx) {
        if (!id_organizacion)
            throw new Error('id_organizacion requerido');
        const payload = {
            id_organizacion,
            nombre_asesor: cleanStr(data.nombre_asesor),
            apellido_pat_asesor: cleanStr(data.apellido_pat_asesor),
            apellido_mat_asesor: cleanStr(data.apellido_mat_asesor),
            alias: cleanStr(data.alias),
            porcentaje_comision: data.porcentaje_comision,
            observaciones: (data.observaciones ?? '').trim(),
            activo: data.activo ?? true
        };
        return AsesorRepository_1.AsesorRepository.create(payload, tx);
    }
    static async getAll(id_organizacion) {
        if (!id_organizacion)
            throw new Error('id_organizacion requerido');
        return AsesorRepository_1.AsesorRepository.findAllByOrganizacion(id_organizacion);
    }
    static async getById(id_asesor, id_organizacion) {
        const row = await AsesorRepository_1.AsesorRepository.findByIdScoped(id_asesor, id_organizacion);
        if (!row)
            throw new Error('Asesor no encontrado');
        return row;
    }
    static async updateById(id_asesor, id_organizacion, data, tx) {
        const patch = {};
        if (data.nombre_asesor !== undefined)
            patch.nombre_asesor = cleanStr(data.nombre_asesor);
        if (data.apellido_pat_asesor !== undefined)
            patch.apellido_pat_asesor = cleanStr(data.apellido_pat_asesor);
        if (data.apellido_mat_asesor !== undefined)
            patch.apellido_mat_asesor = cleanStr(data.apellido_mat_asesor);
        if (data.alias !== undefined)
            patch.alias = cleanStr(data.alias);
        if (data.porcentaje_comision !== undefined)
            patch.porcentaje_comision = data.porcentaje_comision;
        if (data.observaciones !== undefined)
            patch.observaciones = (data.observaciones ?? '').trim();
        if (data.activo !== undefined)
            patch.activo = data.activo;
        const { count, row } = await AsesorRepository_1.AsesorRepository.updateByIdScopedReturning(id_asesor, id_organizacion, patch, tx);
        if (!count || !row)
            throw new Error('Asesor no encontrado');
        return row;
    }
    static async toggleActivo(id_asesor, id_organizacion, tx) {
        const { count, row } = await AsesorRepository_1.AsesorRepository.toggleActivoScopedReturning(id_asesor, id_organizacion, tx);
        if (!count || !row)
            throw new Error('Asesor no encontrado');
        return row;
    }
}
exports.AsesorService = AsesorService;
//# sourceMappingURL=Asesor.service.js.map