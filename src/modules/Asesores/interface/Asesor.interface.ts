// src/modules/Asesores/interfaces/asesor.dto.ts
export interface ICreateAsesorDTO {
  // idealmente viene del token
  id_organizacion?: string;

  nombre_asesor: string;
  apellido_pat_asesor: string;
  apellido_mat_asesor: string;

  alias: string;
  porcentaje_comision: number; // DECIMAL en DB, tú mandas number
  observaciones?: string;

  activo?: boolean; // default true
}

export interface IUpdateAsesorDTO {
  nombre_asesor?: string;
  apellido_pat_asesor?: string;
  apellido_mat_asesor?: string;

  alias?: string;
  porcentaje_comision?: number;
  observaciones?: string;

  activo?: boolean;
}
