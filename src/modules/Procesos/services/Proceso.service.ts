import { ICreateProcesoDTO, IUpdateProcesoDTO, IUploadProcesoArchivoDTO } from '../interface/Proceso.interface';
import { ProcesoRepository } from '../repositories/ProcesoRepository';

export const ProcesoService = {
  calcBono(data: { tipo_firma?: string; encuesta_aplicada?: boolean }) {
    const base = data.tipo_firma === 'ASESOR' ? 700 : 0;
    const extra = data.encuesta_aplicada ? 100 : 0;
    return (base + extra).toFixed(2);
  },

  create: async (data: ICreateProcesoDTO) => {
    // ✅ OJO: referenciar con el objeto
    const bono = ProcesoService.calcBono({ tipo_firma: data.tipo_firma, encuesta_aplicada: data.encuesta_aplicada });

    const payload: ICreateProcesoDTO = {
      ...data,
      bono_asesora: data.bono_asesora ?? bono
    };

    return await ProcesoRepository.create(payload);
  },

  getById: async (id_proceso: string) => {
    return await ProcesoRepository.findById(id_proceso);
  },

  update: async (id_proceso: string, data: IUpdateProcesoDTO) => {
    const shouldRecalc =
      (data.tipo_firma !== undefined || data.encuesta_aplicada !== undefined) && data.bono_asesora === undefined;

    const patch: IUpdateProcesoDTO = { ...data };

    if (shouldRecalc) {
      patch.bono_asesora = ProcesoService.calcBono({
        tipo_firma: data.tipo_firma,
        encuesta_aplicada: data.encuesta_aplicada
      });
    }

    if (patch.listo_para_cobro) {
      if (!patch.fecha_cobro) throw new Error('fecha_cobro requerida');
      if (!patch.tipo_cobro) throw new Error('tipo_cobro requerido');
      if (!patch.monto_cobrar) throw new Error('monto_cobrar requerido');
    }

    return await ProcesoRepository.update(id_proceso, patch);
  },

  listByCliente: async (id_cliente: string) => {
    return await ProcesoRepository.listByCliente(id_cliente);
  },

  uploadArchivo: async (dto: IUploadProcesoArchivoDTO, file: Express.Multer.File) => {
    const proceso = await ProcesoRepository.findById(dto.id_proceso);
    if (!proceso) throw new Error('Proceso no existe');

    return await ProcesoRepository.createArchivo({
      id_proceso: dto.id_proceso,
      categoria: dto.categoria,
      nombre_original: file.originalname,
      mime_type: file.mimetype,
      tamano_bytes: file.size,
      storage_provider: 'LOCAL',
      storage_bucket: null,
      storage_path: file.path,
      public_url: null,
      activo: true
    });
  },

  listArchivos: async (id_proceso: string) => {
    return ProcesoRepository.listArchivos(id_proceso);
  }
};
