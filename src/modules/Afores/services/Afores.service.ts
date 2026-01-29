import { ICreateAforeDTO, IUpdateAforeDTO } from '../interface/Afore.interface';
import { AforeRepository } from '../repositories/AforesRepository';

export const AforeService = {
  create: async (data: ICreateAforeDTO) => {
    if (!data?.nombre_afore?.trim()) {
      throw new Error('nombre_afore es requerido');
    }

    const yaExiste = await AforeRepository.existsByNombre(data.nombre_afore);
    if (yaExiste) throw new Error('Ya existe una AFORE con ese nombre');

    return AforeRepository.create(data.nombre_afore);
  },
  getAll: async () => {
    const result = await AforeRepository.getAll();
    if (!result) throw new Error('No existe clietnes');
    return result;
  },
  getById: async (id_afore: string) => {
    const item = await AforeRepository.findById(id_afore);
    if (!item) throw new Error('AFORE no encontrada');
    return item;
  },
  update: async (id_afore: string, data: IUpdateAforeDTO) => {
    if (!data?.nombre_afore?.trim()) {
      throw new Error('nombre_afore es requerido');
    }

    const yaExiste = await AforeRepository.existsByNombre(data.nombre_afore, id_afore);
    if (yaExiste) throw new Error('Ya existe una AFORE con ese nombre');

    return await AforeRepository.updateById(id_afore, data.nombre_afore);
  },
  actualizarStatus: async (id_afore: string) => {
    return await AforeRepository.cambiarStatusByID(id_afore);
  }
};
