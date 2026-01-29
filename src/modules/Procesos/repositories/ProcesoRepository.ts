// src/modules/Proceso/repository/ProcesoRepository.ts
import { ICreateProcesoDTO, IUpdateProcesoDTO } from '../interface/Proceso.interface';
import Proceso from '../model/Proceso';
import ProcesoArchivo from '../model/ProcesoArchivo';

export const ProcesoRepository = {
  create: async (data: ICreateProcesoDTO) => {
    console.log('PROCESORESPOSITORY', data);
    return await Proceso.create({ ...data });
  },

  findById: async (id_proceso: string) => {
    return await Proceso.findByPk(id_proceso, { include: [ProcesoArchivo] });
  },

  update: async (id_proceso: string, data: IUpdateProcesoDTO) => {
    const row = await Proceso.findByPk(id_proceso);
    if (!row) return null;
    await row.update({ ...data });
    return row;
  },

  listByCliente: async (id_cliente: string) => {
    return await Proceso.findAll({
      where: { id_cliente },
      order: [['createdAt', 'DESC']]
    });
  },

  // ==== Archivos ====
  createArchivo: async (data: {
    id_proceso: string;
    categoria: any;
    nombre_original: string;
    mime_type: string;
    tamano_bytes: number;
    storage_provider?: string | null;
    storage_bucket?: string | null;
    storage_path: string;
    public_url?: string | null;
    activo?: boolean;
  }) => {
    return await ProcesoArchivo.create(data as any);
  },

  listArchivos: async (id_proceso: string) => {
    return await ProcesoArchivo.findAll({
      where: { id_proceso, activo: true },
      order: [['createdAt', 'DESC']]
    });
  }
};
