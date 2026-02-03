"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesServices = void 0;
const ClientesRepository_1 = require("../repositories/ClientesRepository");
exports.ClientesServices = {
    getAllPaginated: async ({ page, limit, search }) => {
        return await ClientesRepository_1.ClientesRepository.getAllPaginated({ /*id_organizacion*/ page, limit, search });
    },
    getById: async (id_cliente) => {
        if (!id_cliente)
            throw new Error('id_cliente es requerido');
        const result = await ClientesRepository_1.ClientesRepository.getById(id_cliente);
        if (!result)
            throw new Error('Cliente no encontrado');
        return result;
    },
    create: async (data, id_organizacion) => {
        data.id_organizacion = id_organizacion;
        // validaciones mínimas
        if (!data?.id_organizacion)
            throw new Error('id_organizacion es requerido');
        if (!data?.id_asesor)
            throw new Error('id_asesor es requerido');
        required(data.nombre_cliente, 'nombre_cliente');
        required(data.apellido_pat_cliente, 'apellido_pat_cliente');
        required(data.apellido_mat_cliente, 'apellido_mat_cliente');
        required(data.curp_cliente, 'curp_cliente');
        required(data.nss_cliente, 'nss_cliente');
        required(data.rfc_cliente, 'rfc_cliente');
        required(data.telefono_cliente, 'telefono_cliente');
        required(data.email_cliente, 'email_cliente');
        return await ClientesRepository_1.ClientesRepository.create(data);
    },
    update: async (id_cliente, data) => {
        if (!id_cliente)
            throw new Error('id_cliente es requerido');
        const existe = await ClientesRepository_1.ClientesRepository.getById(id_cliente);
        if (!existe)
            throw new Error('Cliente no encontrado');
        return await ClientesRepository_1.ClientesRepository.update(id_cliente, data);
    },
    toggleActivo: async (id_cliente) => {
        if (!id_cliente)
            throw new Error('id_cliente es requerido');
        const updated = await ClientesRepository_1.ClientesRepository.toggleActivo(id_cliente);
        if (!updated)
            throw new Error('Cliente no encontrado');
        return updated;
    }
};
function required(value, field) {
    if (!String(value ?? '').trim())
        throw new Error(`${field} es requerido`);
}
//# sourceMappingURL=Clientes.services.js.map