// src/modules/Asesores/repository/AsesorRepository.ts
import { Transaction } from 'sequelize';
import Asesor from '../model/Asesor';
import { ICreateAsesorDTO } from '../interface/Asesor.interface';
import { v4 as uuidv4 } from 'uuid';
export const AsesorRepository = {
  create: async (data: ICreateAsesorDTO, tx?: Transaction) => {
    return Asesor.create(
      {
        id_asesor: uuidv4(),
        ...data
      },
      { transaction: tx }
    );
  },

  findAllByOrganizacion: async (id_organizacion: string) => {
    return Asesor.findAll({
      where: { id_organizacion },
      order: [['createdAt', 'DESC']]
    });
  },

  findByIdScoped: async (id_asesor: string, id_organizacion: string) => {
    return Asesor.findOne({ where: { id_asesor, id_organizacion } });
  },

  updateByIdScopedReturning: async (id_asesor: string, id_organizacion: string, data: any, tx?: Transaction) => {
    const [count, rows] = await Asesor.update(data, {
      where: { id_asesor, id_organizacion },
      returning: true, // Postgres
      transaction: tx
    });

    return { count, row: rows?.[0] ?? null };
  },

  toggleActivoScopedReturning: async (id_asesor: string, id_organizacion: string, tx?: Transaction) => {
    const [count, rows] = await Asesor.update(
      // NOT activo (atómico)
      { activo: (Asesor.sequelize as any)!.literal('NOT activo') },
      { where: { id_asesor, id_organizacion }, returning: true, transaction: tx }
    );

    return { count, row: rows?.[0] ?? null };
  }
};
