export type DashboardResponse = {
    kpis: {
        activos: number;
        bloqueados: number;
        cancelados: number;
        tramite_solicitado: number;
        tramite_sin_resultado: number;
        listos_para_cobro: number;
        pendientes_por_cobrar: number;
        comision_total: number;
        bono_total: number;
        docs_completos: number;
        docs_incompletos: number;
        citas_proximas_7: number;
        citas_vencidas: number;
        dias46_proximos_7: number;
        dias46_vencidos: number;
        inconsistencia_tramite: number;
    };
    pendientesCriticos: Array<{
        tipo: string;
        titulo: string;
        count: number;
        severidad: 'warn' | 'bad';
        accion: {
            label: string;
            route: string;
        };
    }>;
    calendario: Array<{
        id: string;
        date: string;
        tipo: 'CITA_AFORE' | 'DIAS_46' | 'COBRO' | 'DOCS_PENDIENTES';
        titulo: string;
        id_proceso: string;
        id_cliente: string;
        estatus: string | null;
    }>;
    topFaltantes: Array<{
        doc: string;
        label: string;
        count: number;
    }>;
};
export type ListInput = {
    id_organizacion: string;
    page: number;
    limit: number;
    search?: string;
    f?: string;
    today: string;
};
