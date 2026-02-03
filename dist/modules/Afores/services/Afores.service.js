"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AforeService = void 0;
const AforesRepository_1 = require("../repositories/AforesRepository");
exports.AforeService = {
    create: async (data) => {
        if (!data?.nombre_afore?.trim()) {
            throw new Error('nombre_afore es requerido');
        }
        const yaExiste = await AforesRepository_1.AforeRepository.existsByNombre(data.nombre_afore);
        if (yaExiste)
            throw new Error('Ya existe una AFORE con ese nombre');
        return AforesRepository_1.AforeRepository.create(data.nombre_afore);
    },
    getAll: async () => {
        const result = await AforesRepository_1.AforeRepository.getAll();
        if (!result)
            throw new Error('No existe clietnes');
        return result;
    },
    getById: async (id_afore) => {
        const item = await AforesRepository_1.AforeRepository.findById(id_afore);
        if (!item)
            throw new Error('AFORE no encontrada');
        return item;
    },
    update: async (id_afore, data) => {
        if (!data?.nombre_afore?.trim()) {
            throw new Error('nombre_afore es requerido');
        }
        const yaExiste = await AforesRepository_1.AforeRepository.existsByNombre(data.nombre_afore, id_afore);
        if (yaExiste)
            throw new Error('Ya existe una AFORE con ese nombre');
        return await AforesRepository_1.AforeRepository.updateById(id_afore, data.nombre_afore);
    },
    actualizarStatus: async (id_afore) => {
        return await AforesRepository_1.AforeRepository.cambiarStatusByID(id_afore);
    }
};
//# sourceMappingURL=Afores.service.js.map