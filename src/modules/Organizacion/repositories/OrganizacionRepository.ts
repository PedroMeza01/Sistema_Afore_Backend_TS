import { Op, Transaction } from 'sequelize';
import { ICrearOrganizacionDTO } from '../interface/Organizacion.interface';
import Organizacion from '../model/Organizacion';
import { v4 as uuidv4 } from 'uuid';
// AJUSTA el import a tu ruta real del model

export const OrganizacionRepository = {
  getAll: async (includeInactivas = false) => {
    return await Organizacion.findAll({
      attributes: ['id_organizacion', 'nombre_organizacion', 'razon_social_organizacion', 'rfc_organizacion'],
      where: includeInactivas ? {} : { estatus_organizacion: true },
      order: [['createdAt', 'DESC']]
    });
  },

  getById: async (id_organizacion: string, options?: { transaction?: Transaction }) => {
    return await Organizacion.findByPk(id_organizacion, {
      transaction: options?.transaction
    });
  },

  existsByRFC: async (rfc_organizacion: string, excludeId?: string) => {
    if (!rfc_organizacion) return false;

    const where: any = { rfc_organizacion };
    if (excludeId) where.id_organizacion = { [Op.ne]: excludeId };

    const count = await Organizacion.count({ where });
    return count > 0;
  },

  create: async (data: ICrearOrganizacionDTO, options?: { transaction?: Transaction }) => {
    //console.log(data);
    return await Organizacion.create(
      {
        id_organizacion: uuidv4(),
        ...data
      },
      {
        transaction: options?.transaction
      }
    );
  },

  updateById: async (id_organizacion: string, data: any, options?: { transaction?: Transaction }) => {
    await Organizacion.update(data, {
      where: { id_organizacion },
      transaction: options?.transaction
    });

    return await OrganizacionRepository.getById(id_organizacion, options);
  },

  setStatus: async (
    id_organizacion: string,
    estatus_organizacion: boolean,
    options?: { transaction?: Transaction }
  ) => {
    return await Organizacion.update(
      { estatus_organizacion },
      { where: { id_organizacion }, transaction: options?.transaction }
    );
  }
};
