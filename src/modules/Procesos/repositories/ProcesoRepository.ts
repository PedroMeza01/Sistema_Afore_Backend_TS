// src/modules/Proceso/repository/ProcesoRepository.ts
import { ICreateProcesoDTO, IUpdateProcesoDTO } from '../interface/Proceso.interface';
import Proceso from '../model/Proceso';
import ProcesoArchivo from '../model/ProcesoArchivo';

type FindArchivoByIdInput = {
  id_proceso_archivo: string;
  id_organizacion?: string;
};

type UpdateArchivoInput = {
  id_proceso_archivo: string;
  id_organizacion?: string;

  categoria: string | null;

  nombre_original: string;
  mime_type: string;
  tamano_bytes: number;

  storage_provider: string; // 'LOCAL' | 'SUPABASE' | ...
  storage_bucket: string | null;
  storage_path: string;
  public_url: string | null;

  activo: boolean;
};

type CreateArchivoInput = {
  id_proceso: string;
  id_organizacion: string;

  categoria: string | null;

  nombre_original: string;
  mime_type: string;
  tamano_bytes: number;

  storage_provider: string;
  storage_bucket: string | null;
  storage_path: string;
  public_url: string | null;

  activo: boolean;
};
export const ProcesoRepository = {
  findArchivoById: async (input: FindArchivoByIdInput) => {
    const where: any = { id_proceso_archivo: input.id_proceso_archivo };
    if (input.id_organizacion) where.id_organizacion = input.id_organizacion;

    return await ProcesoArchivo.findOne({ where });
  },
  create: async (data: ICreateProcesoDTO, id_organizacion: string) => {
    // console.log('PROCESORESPOSITORY', data);
    return await Proceso.create({ ...data, id_organizacion });
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
  },
  updateArchivo: async (input: UpdateArchivoInput) => {
    const where: any = { id_proceso_archivo: input.id_proceso_archivo };
    if (input.id_organizacion) where.id_organizacion = input.id_organizacion;

    const [affected, rows] = await ProcesoArchivo.update(
      {
        categoria: input.categoria,

        nombre_original: input.nombre_original,
        mime_type: input.mime_type,
        tamano_bytes: input.tamano_bytes,

        storage_provider: input.storage_provider,
        storage_bucket: input.storage_bucket,
        storage_path: input.storage_path,
        public_url: input.public_url,

        activo: input.activo
      },
      { where, returning: true }
    );

    if (affected === 0) return null;
    // returning:true => rows[0] es el registro actualizado
    return rows?.[0] ?? null;
  }
};
