// src/modules/Proceso/interfaces/proceso.dto.ts
import type { EstatusProceso, ModoRetiro, ResultadoTramite, SiNo, TipoCobro, TipoFirma } from '../model/Proceso';
import { CategoriaArchivo } from '../model/ProcesoArchivo';

export interface ICreateProcesoDTO {
  id_organizacion?: string;
  id_cliente: string;
  id_afore: string;
  id_asesor: string;

  fecha_firma: string; // YYYY-MM-DD
  tipo_firma: TipoFirma;

  fecha_baja_imss?: string | null;
  fecha_46_dias?: string | null;

  requiere_cita_afore?: boolean;
  cita_afore?: string | null;

  acompanamiento?: SiNo;
  modo_retiro?: ModoRetiro;

  expediente_actualizado?: boolean;
  app_vinculada?: boolean;

  tramite_solicitado?: boolean;
  resultado_tramite?: ResultadoTramite | null;
  observacion_tramite?: string | null;

  listo_para_cobro?: boolean;
  fecha_cobro?: string | null;
  tipo_cobro?: TipoCobro | null;
  monto_cobrar?: string | null;
  comision_asesora?: string | null;
  encuesta_aplicada?: boolean;
  bono_asesora?: string; // DECIMAL string

  estatus_proceso?: EstatusProceso;
  motivo_estatus?: string | null;
}

export interface IUpdateProcesoDTO extends Partial<ICreateProcesoDTO> {}

export interface IUploadProcesoArchivoDTO {
  id_proceso: string;
  categoria: CategoriaArchivo;
  notas?: string | null;
  uploaded_by?: string | null; // si luego lo agregas
}
1;
