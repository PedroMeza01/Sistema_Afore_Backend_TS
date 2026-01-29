import { Transaction } from 'sequelize';
import { dbLocal } from '../../../config/db';
import { OrganizacionRepository } from '../repositories/OrganizacionRepository';
import { ICrearOrganizacionDTO } from '../interface/Organizacion.interface';

export const OrganizacionService = {
  create: async (data: ICrearOrganizacionDTO) => {
    const t = await dbLocal.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    });
    if (!data?.nombre_organizacion?.trim()) {
      throw new Error('nombre_organizacion es requerido');
    }

    if (data.rfc_organizacion) {
      const existe = await OrganizacionRepository.existsByRFC(data.rfc_organizacion);
      //await t.rollback();
      if (existe) throw new Error('Ya existe una organización con ese RFC');
    }
    const org = await OrganizacionRepository.create(data, { transaction: t });
    // console.log(org);
    await t.commit();
    return org;
  },

  getAll: async (includeInactivas = false) => {
    return await OrganizacionRepository.getAll(includeInactivas);
  },

  getById: async (id_organizacion: string) => {
    if (!id_organizacion) throw new Error('id_organizacion es requerido');

    const org = await OrganizacionRepository.getById(id_organizacion);
    if (!org) throw new Error('Organización no encontrada');

    return org;
  }
  /*
  update: async (id_organizacion: string, data: any) => {
    const org = await OrganizacionRepository.getById(id_organizacion);
    if (!org) throw new Error('Organización no encontrada');

    if (data?.rfc_organizacion) {
      const existe = await OrganizacionRepository.existsByRFC(data.rfc_organizacion, id_organizacion);
      if (existe) throw new Error('Ya existe una organización con ese RFC');
    }

    return await dbLocal.transaction(async (transaction: Transaction) => {
      return await OrganizacionRepository.updateById(id_organizacion, data, { transaction });
    });
  },

  activar: async (id_organizacion: string) => {
    await OrganizacionService.getById(id_organizacion);
    await OrganizacionRepository.setStatus(id_organizacion, true);
    return await OrganizacionService.getById(id_organizacion);
  },

  desactivar: async (id_organizacion: string) => {
    await OrganizacionService.getById(id_organizacion);
    await OrganizacionRepository.setStatus(id_organizacion, false);
    return await OrganizacionService.getById(id_organizacion);
  }
*/
};
