export interface ICreateClienteDTO {
    id_organizacion: string;
    id_asesor: string;
    nombre_cliente: string;
    apellido_pat_cliente: string;
    apellido_mat_cliente: string;
    curp_cliente: string;
    nss_cliente: string;
    rfc_cliente: string;
    telefono_cliente: string;
    email_cliente: string;
    observaciones?: string;
    activo?: boolean;
}
export interface IUpdateClienteDTO {
    id_organizacion?: string;
    id_asesor?: string;
    nombre_cliente?: string;
    apellido_pat_cliente?: string;
    apellido_mat_cliente?: string;
    curp_cliente?: string;
    nss_cliente?: string;
    rfc_cliente?: string;
    telefono_cliente?: string;
    email_cliente?: string;
    observaciones?: string;
    activo?: boolean;
}
