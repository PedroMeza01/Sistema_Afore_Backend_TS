// src/modules/Proceso/repository/ProcesoRepository.ts
import { Transaction } from 'sequelize';
import { ICreateProcesoDTO, IUpdateProcesoDTO } from '../interface/Proceso.interface';
import Proceso from '../model/Proceso';
import ProcesoArchivo from '../model/ProcesoArchivo';
import Cliente from '../../Clientes/model/Clientes';
import Organizacion from '../../Organizacion/model/Organizacion';
import Afores from '../../Afores/model/Afores';
import Asesor from '../../Asesores/model/Asesor';

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

// ===== Cierre de Proceso (snapshot + borrado) =====

type GetSnapshotParaCierreInput = {
  id_proceso: string;
  id_cliente?: string; // opcional si quieres validar que pertenezca al cliente
  id_organizacion?: string; // opcional si quieres forzar multi-tenant
};

export type ProcesoCierreSnapshot = {
  proceso: Proceso;
  archivos: ProcesoArchivo[];
};

type DeleteByProcesoInput = {
  id_proceso: string;
  id_organizacion?: string;
  transaction?: Transaction;
};

type DeleteProcesoInput = {
  id_proceso: string;
  id_organizacion?: string;
  transaction?: Transaction;
};

type DeleteProcesoAndArchivosInput = {
  id_proceso: string;
  id_organizacion?: string;
  transaction?: Transaction;
};

export const ProcesoRepository = {
  // ===== Proceso =====

  create: async (data: ICreateProcesoDTO, id_organizacion: string) => {
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

  // ===== Archivos =====

  findArchivoById: async (input: FindArchivoByIdInput) => {
    const where: any = { id_proceso_archivo: input.id_proceso_archivo };
    if (input.id_organizacion) where.id_organizacion = input.id_organizacion;

    return await ProcesoArchivo.findOne({ where });
  },

  createArchivo: async (data: Partial<ProcesoArchivo>) => {
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
    return rows?.[0] ?? null;
  },

  // ===== Cierre de proceso =====
  // 1) Snapshot para armar correo + descargar archivos + luego borrar todo
  getSnapshotParaCierre: async (input: GetSnapshotParaCierreInput): Promise<ProcesoCierreSnapshot | null> => {
    const whereProceso: any = { id_proceso: input.id_proceso };
    if (input.id_cliente) whereProceso.id_cliente = input.id_cliente;
    if (input.id_organizacion) whereProceso.id_organizacion = input.id_organizacion;

    const proceso = await Proceso.findOne({
      where: whereProceso,
      include: [
        {
          model: Cliente,
          required: false
        },
        {
          model: Organizacion,
          attributes: ['nombre_organizacion', 'email_contacto_organizacion'], // solo nombre
          required: false
        },
        {
          model: Afores,
          attributes: ['nombre_afore'], // solo nombre
          required: false
        },
        {
          model: Asesor,
          attributes: ['nombre_asesor', 'apellido_pat_asesor', 'apellido_mat_asesor'], // solo nombre
          required: false
        }
      ]
    });

    if (!proceso) return null;

    if (proceso.estatus_proceso === 'ACTIVO') {
      throw new Error('No se puede finalizar un proceso en estado ACTIVO');
    }

    const whereArchivos: any = { id_proceso: input.id_proceso, activo: true };
    const archivos = await ProcesoArchivo.findAll({
      where: whereArchivos,
      order: [['createdAt', 'DESC']]
    });

    return { proceso, archivos };
  },

  // 2) Borrar SOLO archivos (DB)
  deleteArchivosByProceso: async (input: DeleteByProcesoInput) => {
    const where: any = { id_proceso: input.id_proceso };

    return await ProcesoArchivo.destroy({
      where,
      transaction: input.transaction
    });
  },

  // 3) Borrar SOLO proceso (DB)
  deleteProceso: async (input: DeleteProcesoInput) => {
    const where: any = { id_proceso: input.id_proceso };
    if (input.id_organizacion) where.id_organizacion = input.id_organizacion;

    return await Proceso.destroy({
      where,
      transaction: input.transaction
    });
  }
};
