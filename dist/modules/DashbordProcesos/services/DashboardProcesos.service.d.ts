export declare class DashboardService {
    static getDashboard(input: {
        id_organizacion: string;
    }): Promise<{
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
        pendientesCriticos: {
            tipo: string;
            titulo: string;
            count: number;
            severidad: string;
            accion: {
                label: string;
                route: string;
            };
        }[];
        calendario: {
            id: string;
            date: any;
            tipo: any;
            titulo: any;
            id_proceso: any;
            id_cliente: any;
            estatus: any;
        }[];
        topFaltantes: {
            doc: string;
            label: string;
            count: number;
        }[];
    }>;
}
