import { ListInput } from '../interface/DashboardResponse';
export declare const DashboardProcesosRepository: {
    listPaginated: (input: ListInput) => Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            search: string;
            f: string;
        };
    }>;
    getKPIs: (input: {
        id_organizacion: string;
        today: string;
        todayPlus30: string;
    }) => Promise<{
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
    }>;
    getTopFaltantes: (input: {
        id_organizacion: string;
    }) => Promise<{
        doc: string;
        label: string;
        count: number;
    }[]>;
    getCalendario: (input: {
        id_organizacion: string;
        today: string;
        todayPlus30: string;
    }) => Promise<{
        id: string;
        date: any;
        tipo: any;
        titulo: any;
        id_proceso: any;
        id_cliente: any;
        estatus: any;
    }[]>;
};
