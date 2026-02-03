"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const DashboardProcesosRepository_1 = require("../repositories/DashboardProcesosRepository");
function toDateOnly(d) {
    return d.toISOString().slice(0, 10);
}
class DashboardService {
    static async getDashboard(input) {
        const now = new Date();
        const today = toDateOnly(now);
        const plus30 = new Date(now);
        plus30.setDate(plus30.getDate() + 30);
        const todayPlus30 = toDateOnly(plus30);
        const [kpis, topFaltantes, calendario] = await Promise.all([
            DashboardProcesosRepository_1.DashboardProcesosRepository.getKPIs({ id_organizacion: input.id_organizacion, today, todayPlus30 }),
            DashboardProcesosRepository_1.DashboardProcesosRepository.getTopFaltantes({ id_organizacion: input.id_organizacion }),
            DashboardProcesosRepository_1.DashboardProcesosRepository.getCalendario({ id_organizacion: input.id_organizacion, today, todayPlus30 })
        ]);
        const pendientesCriticos = [
            {
                tipo: 'TRAMITE_SIN_RESULTADO',
                titulo: 'Trámite solicitado sin resultado',
                count: kpis.tramite_sin_resultado,
                severidad: 'warn',
                accion: { label: 'Ver lista', route: '/procesos?f=tramite_sin_resultado' }
            },
            {
                tipo: 'DOCS_INCOMPLETOS',
                titulo: 'Expedientes incompletos',
                count: kpis.docs_incompletos,
                severidad: 'warn',
                accion: { label: 'Ver lista', route: '/procesos?f=docs_incompletos' }
            },
            {
                tipo: 'CITAS_VENCIDAS',
                titulo: 'Citas Afore vencidas',
                count: kpis.citas_vencidas,
                severidad: 'bad',
                accion: { label: 'Ver lista', route: '/procesos?f=citas_vencidas' }
            },
            {
                tipo: 'DIAS46_VENCIDOS',
                titulo: '46 días vencidos',
                count: kpis.dias46_vencidos,
                severidad: 'bad',
                accion: { label: 'Ver lista', route: '/procesos?f=46_vencidos' }
            },
            {
                tipo: 'INCONSISTENCIA_TRAMITE',
                titulo: 'Trámite marcado sin Expediente/App',
                count: kpis.inconsistencia_tramite,
                severidad: 'bad',
                accion: { label: 'Revisar', route: '/procesos?f=inconsistencia_tramite' }
            }
        ].filter(x => x.count > 0);
        return { kpis, pendientesCriticos, calendario, topFaltantes };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=DashboardProcesos.service.js.map