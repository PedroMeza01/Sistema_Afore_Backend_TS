export interface ICreateAsesorDTO {
    id_organizacion?: string;
    nombre_asesor: string;
    apellido_pat_asesor: string;
    apellido_mat_asesor: string;
    alias: string;
    porcentaje_comision: number;
    observaciones?: string;
    activo?: boolean;
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
