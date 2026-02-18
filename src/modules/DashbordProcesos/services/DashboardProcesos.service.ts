import { DashboardProcesosRepository } from '../repositories/DashboardProcesosRepository';

function toDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

export class DashboardService {
  static async getDashboard(input: { id_organizacion: string }) {
    const now = new Date();
    const today = toDateOnly(now);

    const plus6Dias = new Date(now);
    plus6Dias.setDate(plus6Dias.getDate() + 6);
    const todayPlus30 = toDateOnly(plus6Dias);

    const [kpis, topFaltantes, calendario] = await Promise.all([
      DashboardProcesosRepository.getKPIs({ id_organizacion: input.id_organizacion, today, todayPlus30 }),
      DashboardProcesosRepository.getTopFaltantes({ id_organizacion: input.id_organizacion }),
      DashboardProcesosRepository.getCalendario({ id_organizacion: input.id_organizacion, today, todayPlus30 })
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
