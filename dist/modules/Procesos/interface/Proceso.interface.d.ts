export interface ICreateProcesoDTO {
    id_organizacion?: string;
    id_cliente: string;
    id_afore: string;
    id_asesor: string;
    fecha_firma: string;
    tipo_firma: string;
    fecha_baja_imss?: string | null;
    fecha_46_dias?: string | null;
    requiere_cita_afore?: boolean;
    cita_afore?: string | null;
    acompanamiento?: string;
    modo_retiro?: string;
    expediente_actualizado?: boolean;
    app_vinculada?: boolean;
    tramite_solicitado?: boolean;
    resultado_tramite?: string | null;
    observacion_tramite?: string | null;
    listo_para_cobro?: boolean;
    fecha_cobro?: string | null;
    tipo_cobro?: string | null;
    monto_cobrar?: string | null;
    comision_asesora?: string | null;
    encuesta_aplicada?: boolean;
    bono_asesora?: string;
    estatus_proceso?: string;
    motivo_estatus?: string | null;
}
export interface IUpdateProcesoDTO extends Partial<ICreateProcesoDTO> {
}
export interface IUploadProcesoArchivoDTO {
    id_proceso: string;
    categoria: string;
    notas?: string | null;
    uploaded_by?: string | null;
}
