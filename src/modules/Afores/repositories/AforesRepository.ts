import { Transaction, Op, literal } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Afores from '../model/Afores';
export const AforeRepository = {
  create: async (nombre_afore: string, tx?: Transaction) => {
    return await Afores.create(
      {
        id_afore: uuidv4(),
        nombre_afore
      },
      { transaction: tx }
    );
  },
  getAll: async () => {
    return await Afores.findAll();
  },
  findById: async (id_afore: string) => {
    return await Afores.findByPk(id_afore);
  },
  existsByNombre: async (nombre_afore: string, excludeId?: string) => {
    const where: any = { nombre_afore: nombre_afore.trim() };
    if (excludeId) where.id_afore = { [Op.ne]: excludeId };

    const count = await Afores.count({ where });
    return count > 0;
  },
  updateById: async (id_afore: string, nombre_afore: string, tx?: Transaction) => {
    const actualizado = Afores.update({ nombre_afore: nombre_afore.trim() }, { where: { id_afore }, transaction: tx });
    return actualizado;
  },

  cambiarStatusByID: async (id_afore: string, tx?: Transaction) => {
    const afore = await Afores.findByPk(id_afore, { transaction: tx });
    if (!afore) throw new Error('AFORE no encontrado');

    return afore.update({ activo_afore: !afore.activo_afore }, { transaction: tx });
  }
};
