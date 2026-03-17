// src/modules/DashbordProcesos/repositories/DashboardProcesosRepository.ts
import { QueryTypes, Sequelize } from 'sequelize';
import Proceso from '../../Procesos/model/Proceso';
import { dbLocal } from '../../../config/db';
import { ListInput } from '../interface/DashboardResponse';

const REQUIRED_DOCS = ['INE_FRENTE', 'INE_POSTERIOR', 'ESTADO_CUENTA', 'COMPROBANTE_DOM', 'CONTRATO_PAGARE'];
const normalizeDate = (v?: string) => {
  const s = (v ?? '').trim();
  return s ? s : null;
};

export const DashboardProcesosRepository = {
  listPaginated: async (input: ListInput) => {
    const { id_organizacion, page, limit, search, f, today } = input;

    // Normaliza para evitar ''::date
    const desde = normalizeDate(input.desde);
    const hasta = normalizeDate(input.hasta);

    const offset = (page - 1) * limit;

    const whereSearch = search?.trim()
      ? `
        AND (
          (c.nombre_cliente || ' ' || c.apellido_pat_cliente || ' ' || c.apellido_mat_cliente) ILIKE :searchLike
          OR c.curp_cliente ILIKE :searchLike
          OR c.nss_cliente ILIKE :searchLike
          OR c.rfc_cliente ILIKE :searchLike
          OR c.telefono_cliente ILIKE :searchLike
          OR c.email_cliente ILIKE :searchLike
        )
      `
      : '';

    const filterSql = buildFilterSql(f);

    // ✅ Filtro rango por FECHA FIRMA (TIMESTAMP): incluye todo el día "hasta"
    // Cambia p.fecha_firma_proceso por el nombre real de tu columna
    const whereFirma = `
      AND (:desde IS NULL OR p.fecha_firma >= :desde::date)
      AND (:hasta IS NULL OR p.fecha_firma < (:hasta::date + INTERVAL '1 day'))
    `;

    // COUNT total
    const countRows = await dbLocal.query<{ total: number }>(
      `
      WITH base AS (
        SELECT
          p.id_proceso,
          p.id_cliente,
          p.estatus_proceso,
          p.tramite_solicitado,
          p.resultado_tramite,
          p.expediente_actualizado,
          p.app_vinculada,
          p.cita_afore,
          p.fecha_46_dias,
          p.fecha_cobro,
          (c.nombre_cliente || ' ' || c.apellido_pat_cliente || ' ' || c.apellido_mat_cliente) AS cliente_nombre,
          c.curp_cliente,
          c.telefono_cliente,
          COUNT(DISTINCT pa.categoria) FILTER (
            WHERE pa.activo = true AND pa.categoria = ANY(ARRAY[:requiredDocs]::text[])
          ) AS docs_count
        FROM proceso p
        JOIN cliente c ON c.id_cliente = p.id_cliente
        LEFT JOIN proceso_archivo pa ON pa.id_proceso = p.id_proceso
        WHERE p.id_organizacion = :idOrg
        ${whereFirma}
        ${whereSearch}
        GROUP BY
          p.id_proceso, p.id_cliente, p.estatus_proceso,
          p.tramite_solicitado, p.resultado_tramite, p.expediente_actualizado, p.app_vinculada,
          p.cita_afore, p.fecha_46_dias, p.fecha_cobro,
          cliente_nombre, c.curp_cliente, c.telefono_cliente
      )
      SELECT COUNT(*)::int AS total
      FROM base
      WHERE 1=1
      ${filterSql}
      ;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          idOrg: id_organizacion,
          requiredDocs: REQUIRED_DOCS,
          searchLike: `%${(search ?? '').trim()}%`,
          reqLen: REQUIRED_DOCS.length,
          today,
          desde,
          hasta
        }
      }
    );

    const totalItems = Number(countRows?.[0]?.total ?? 0);
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    // ITEMS paginados
    const items = await dbLocal.query<any>(
      `
      WITH base AS (
        SELECT
          p.id_proceso,
          p.id_cliente,
          p.estatus_proceso,
          p.tramite_solicitado,
          p.resultado_tramite,
          p.expediente_actualizado,
          p.app_vinculada,
          p.cita_afore,
          p.fecha_46_dias,
          p.fecha_cobro,
          (c.nombre_cliente || ' ' || c.apellido_pat_cliente || ' ' || c.apellido_mat_cliente) AS cliente_nombre,
          c.curp_cliente,
          c.telefono_cliente,
          COUNT(DISTINCT pa.categoria) FILTER (
            WHERE pa.activo = true AND pa.categoria = ANY(ARRAY[:requiredDocs]::text[])
          ) AS docs_count
        FROM proceso p
        JOIN cliente c ON c.id_cliente = p.id_cliente
        LEFT JOIN proceso_archivo pa ON pa.id_proceso = p.id_proceso
        WHERE p.id_organizacion = :idOrg
        ${whereFirma}
        ${whereSearch}
        GROUP BY
          p.id_proceso, p.id_cliente, p.estatus_proceso,
          p.tramite_solicitado, p.resultado_tramite, p.expediente_actualizado, p.app_vinculada,
          p.cita_afore, p.fecha_46_dias, p.fecha_cobro,
          cliente_nombre, c.curp_cliente, c.telefono_cliente
      )
      SELECT
        id_proceso,
        id_cliente,
        estatus_proceso,
        tramite_solicitado,
        resultado_tramite,
        cita_afore,
        fecha_46_dias,
        fecha_cobro,
        cliente_nombre,
        curp_cliente,
        telefono_cliente,
        docs_count::int AS docs_count,
        :reqLen::int AS docs_required,
        (docs_count = :reqLen)::boolean AS docs_ok,
        (tramite_solicitado = true AND (expediente_actualizado = false OR app_vinculada = false))::boolean AS inconsistencia_tramite
      FROM base
      WHERE 1=1
      ${filterSql}
      ORDER BY cliente_nombre ASC
      LIMIT :limit
      OFFSET :offset
      ;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          idOrg: id_organizacion,
          requiredDocs: REQUIRED_DOCS,
          searchLike: `%${(search ?? '').trim()}%`,
          reqLen: REQUIRED_DOCS.length,
          today,
          desde,
          hasta,
          limit,
          offset
        }
      }
    );

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        search: search ?? '',
        f: f ?? '',
        desde: desde ?? '',
        hasta: hasta ?? ''
      }
    };
  },
  getKPIs: async (input: { id_organizacion: string; today: string; todayPlus30: string }) => {
    const { id_organizacion, today, todayPlus30 } = input;

    const kpiSimple = await Proceso.findOne({
      where: { id_organizacion },
      attributes: [
        [Sequelize.literal(`SUM(CASE WHEN estatus_proceso = 'ACTIVO' THEN 1 ELSE 0 END)`), 'activos'],
        [Sequelize.literal(`SUM(CASE WHEN estatus_proceso = 'BLOQUEADO' THEN 1 ELSE 0 END)`), 'bloqueados'],
        [Sequelize.literal(`SUM(CASE WHEN estatus_proceso = 'CANCELADO' THEN 1 ELSE 0 END)`), 'cancelados'],

        [Sequelize.literal(`SUM(CASE WHEN tramite_solicitado = true THEN 1 ELSE 0 END)`), 'tramite_solicitado'],
        [
          Sequelize.literal(
            `SUM(CASE WHEN tramite_solicitado = true AND (resultado_tramite IS NULL OR resultado_tramite = '') THEN 1 ELSE 0 END)`
          ),
          'tramite_sin_resultado'
        ],

        [Sequelize.literal(`SUM(CASE WHEN listo_para_cobro = true THEN 1 ELSE 0 END)`), 'listos_para_cobro'],
        [
          Sequelize.literal(
            `SUM(CASE WHEN listo_para_cobro = true AND (fecha_cobro IS NULL OR fecha_cobro > '${today}') THEN 1 ELSE 0 END)`
          ),
          'pendientes_por_cobrar'
        ],

        [Sequelize.literal(`COALESCE(SUM(COALESCE(comision_asesora,0)::numeric),0)`), 'comision_total'],
        [Sequelize.literal(`COALESCE(SUM(COALESCE(bono_asesora,0)::numeric),0)`), 'bono_total'],

        [
          Sequelize.literal(
            `SUM(CASE WHEN cita_afore IS NOT NULL AND cita_afore >= '${today}' AND cita_afore <= '${todayPlus30}' THEN 1 ELSE 0 END)`
          ),
          'citas_proximas_7'
        ],
        [
          Sequelize.literal(`SUM(CASE WHEN cita_afore IS NOT NULL AND cita_afore < '${today}' THEN 1 ELSE 0 END)`),
          'citas_vencidas'
        ],

        [
          Sequelize.literal(
            `SUM(CASE WHEN fecha_46_dias IS NOT NULL AND fecha_46_dias >= '${today}' AND fecha_46_dias <= '${todayPlus30}' THEN 1 ELSE 0 END)`
          ),
          'dias46_proximos_7'
        ],
        [
          Sequelize.literal(
            `SUM(CASE WHEN fecha_46_dias IS NOT NULL AND fecha_46_dias < '${today}' THEN 1 ELSE 0 END)`
          ),
          'dias46_vencidos'
        ],

        [
          Sequelize.literal(
            `SUM(CASE WHEN tramite_solicitado = true AND (expediente_actualizado = false OR app_vinculada = false) THEN 1 ELSE 0 END)`
          ),
          'inconsistencia_tramite'
        ],
        [
          Sequelize.literal(`
    SUM(
      CASE
        WHEN fecha_firma IS NOT NULL
        AND (fecha_firma <=  CURRENT_DATE - INTERVAL '10 days')
        AND fecha_baja_imss IS NULL
        THEN 1
        ELSE 0
      END
    )
  `),
          'firma_mas_10_dias'
        ],
        [
          Sequelize.literal(`
             SUM(
                CASE
             WHEN fecha_tramite IS NOT NULL
             AND fecha_tramite::date <= CURRENT_DATE - INTERVAL '5 days'
             THEN 1
          ELSE 0
      END
    )
  `),
          'tramite_mas_5_dias'
        ]
      ],
      raw: true
    });

    // FIX: ANY(ARRAY[:requiredDocs]::text[])
    const docsStats = await dbLocal.query<{ docs_completos: number; docs_incompletos: number }>(
      `
      WITH per_proceso AS (
        SELECT
          p.id_proceso,
          COUNT(DISTINCT pa.categoria) AS docs_count
        FROM proceso p
        LEFT JOIN proceso_archivo pa
          ON pa.id_proceso = p.id_proceso
         AND pa.activo = true
         AND pa.categoria = ANY(ARRAY[:requiredDocs]::text[])
        WHERE p.id_organizacion = :idOrg
        GROUP BY p.id_proceso
      )
      SELECT
        SUM(CASE WHEN docs_count = :reqLen THEN 1 ELSE 0 END)::int AS docs_completos,
        SUM(CASE WHEN docs_count < :reqLen THEN 1 ELSE 0 END)::int AS docs_incompletos
      FROM per_proceso;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          idOrg: id_organizacion,
          requiredDocs: REQUIRED_DOCS,
          reqLen: REQUIRED_DOCS.length
        }
      }
    );

    const s: any = kpiSimple ?? {};
    const d = docsStats[0] ?? { docs_completos: 0, docs_incompletos: 0 };

    return {
      activos: Number(s.activos ?? 0),
      bloqueados: Number(s.bloqueados ?? 0),
      cancelados: Number(s.cancelados ?? 0),
      tramite_solicitado: Number(s.tramite_solicitado ?? 0),
      tramite_sin_resultado: Number(s.tramite_sin_resultado ?? 0),
      listos_para_cobro: Number(s.listos_para_cobro ?? 0),
      pendientes_por_cobrar: Number(s.pendientes_por_cobrar ?? 0),
      comision_total: Number(s.comision_total ?? 0),
      bono_total: Number(s.bono_total ?? 0),
      docs_completos: Number(d.docs_completos ?? 0),
      docs_incompletos: Number(d.docs_incompletos ?? 0),
      citas_proximas_7: Number(s.citas_proximas_7 ?? 0),
      citas_vencidas: Number(s.citas_vencidas ?? 0),
      dias46_proximos_7: Number(s.dias46_proximos_7 ?? 0),
      dias46_vencidos: Number(s.dias46_vencidos ?? 0),
      firma_mas_10_dias: Number(s.firma_mas_10_dias ?? 0),
      inconsistencia_tramite: Number(s.inconsistencia_tramite ?? 0),
      tramite_mas_5_dias: Number(s.tramite_mas_5_dias ?? 0)
    };
  },

  getTopFaltantes: async (input: { id_organizacion: string }) => {
    const { id_organizacion } = input;

    // FIX: UNNEST(ARRAY[:requiredDocs]::text[]) y ANY(ARRAY[:requiredDocs]::text[])
    const rows = await dbLocal.query<{ doc: string; count: number }>(
      `
      WITH procesos_org AS (
        SELECT id_proceso
        FROM proceso
        WHERE id_organizacion = :idOrg
      ),
      docs AS (
        SELECT UNNEST(ARRAY[:requiredDocs]::text[]) AS doc
      ),
      tiene AS (
        SELECT pa.id_proceso, pa.categoria AS doc
        FROM proceso_archivo pa
        JOIN procesos_org po ON po.id_proceso = pa.id_proceso
        WHERE pa.activo = true
          AND pa.categoria = ANY(ARRAY[:requiredDocs]::text[])
        GROUP BY pa.id_proceso, pa.categoria
      )
      SELECT d.doc,
             COUNT(*)::int AS count
      FROM docs d
      CROSS JOIN procesos_org po
      LEFT JOIN tiene t
        ON t.id_proceso = po.id_proceso
       AND t.doc = d.doc
      WHERE t.id_proceso IS NULL
      GROUP BY d.doc
      ORDER BY count DESC;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { idOrg: id_organizacion, requiredDocs: REQUIRED_DOCS }
      }
    );

    const labelMap: Record<string, string> = {
      INE_FRENTE: 'INE Frente',
      INE_POSTERIOR: 'INE Posterior',
      ESTADO_CUENTA: 'Estado de Cuenta',
      COMPROBANTE_DOM: 'Comprobante de Domicilio',
      CONTRATO_PAGARE: 'Contrato/Pagaré'
    };

    return rows.map(r => ({ doc: r.doc, label: labelMap[r.doc] ?? r.doc, count: Number(r.count) }));
  },

  getCalendario: async (input: { id_organizacion: string; today: string; todayPlus30: string }) => {
    const { id_organizacion, today, todayPlus30 } = input;

    // FIX: ANY(ARRAY[:requiredDocs]::text[])
    const rows = await dbLocal.query<any>(
      `
      WITH per_proceso AS (
        SELECT
          p.id_proceso,
          p.id_cliente,
          p.estatus_proceso,
          p.cita_afore,
          p.fecha_46_dias,
          p.fecha_cobro,
          (c.nombre_cliente || ' ' || c.apellido_pat_cliente || ' ' || c.apellido_mat_cliente) AS cliente_nombre,
          COUNT(DISTINCT pa.categoria) FILTER (WHERE pa.activo = true AND pa.categoria = ANY(ARRAY[:requiredDocs]::text[])) AS docs_count
        FROM proceso p
        JOIN cliente c ON c.id_cliente = p.id_cliente
        LEFT JOIN proceso_archivo pa ON pa.id_proceso = p.id_proceso
        WHERE p.id_organizacion = :idOrg
        GROUP BY p.id_proceso, p.id_cliente, p.estatus_proceso, p.cita_afore, p.fecha_46_dias, p.fecha_cobro, cliente_nombre
      )
      SELECT * FROM (
        SELECT
          'CITA_AFORE' AS tipo,
          cita_afore AS date,
          ('Cita Afore – ' || cliente_nombre) AS titulo,
          id_proceso,
          id_cliente,
          estatus_proceso
        FROM per_proceso
        WHERE cita_afore IS NOT NULL
          AND cita_afore >= :today AND cita_afore <= :todayPlus30

        UNION ALL

        SELECT
          'DIAS_46' AS tipo,
          fecha_46_dias AS date,
          ('Fecha 46 días – ' || cliente_nombre) AS titulo,
          id_proceso,
          id_cliente,
          estatus_proceso
        FROM per_proceso
        WHERE fecha_46_dias IS NOT NULL
          AND fecha_46_dias >= :today AND fecha_46_dias <= :todayPlus30

        UNION ALL

        SELECT
          'COBRO' AS tipo,
          fecha_cobro AS date,
          ('Cobro – ' || cliente_nombre) AS titulo,
          id_proceso,
          id_cliente,
          estatus_proceso
        FROM per_proceso
        WHERE fecha_cobro IS NOT NULL
          AND fecha_cobro >= :today AND fecha_cobro <= :todayPlus30
/* 
        UNION ALL

        SELECT
          'DOCS_PENDIENTES' AS tipo,
          :today AS date,
          ('Docs pendientes – ' || cliente_nombre) AS titulo,
          id_proceso,
          id_cliente,
          estatus_proceso
        FROM per_proceso
        WHERE docs_count < :reqLen
        */
      ) x
      WHERE date IS NOT NULL
      ORDER BY date ASC;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          idOrg: id_organizacion,
          requiredDocs: REQUIRED_DOCS,
          reqLen: REQUIRED_DOCS.length,
          today,
          todayPlus30
        }
      }
    );

    return rows.map((r: any, idx: number) => ({
      id: `${r.tipo}-${r.id_proceso}-${idx}`,
      date: r.date,
      tipo: r.tipo,
      titulo: r.titulo,
      id_proceso: r.id_proceso,
      id_cliente: r.id_cliente,
      estatus: r.estatus_proceso
    }));
  }
};
function buildFilterSql(f?: string) {
  const key = (f ?? '').toString().trim();
  if (!key) return '';

  // OJO: esto corre en el SELECT final (sobre el CTE "base"),
  // así que solo puedes usar columnas que estén en "base"
  switch (key) {
    case 'docs_incompletos':
      return `AND docs_count < :reqLen`;

    case 'tramite_sin_resultado':
      // Si en tu sistema "sin resultado" incluye cuando está en SOLICITADO,
      // esto es lo correcto.
      return `
        AND tramite_solicitado = true
        AND (
          resultado_tramite IS NULL
          OR resultado_tramite = ''
          OR resultado_tramite = 'SOLICITADO'
        )
      `;

    case 'citas_vencidas':
      return `AND cita_afore IS NOT NULL AND cita_afore < :today`;

    case '46_vencidos':
      return `AND fecha_46_dias IS NOT NULL AND fecha_46_dias < :today`;

    case 'finalizados':
      return `AND estatus_proceso = 'FINALIZADO'`;

    case 'bloqueados':
      return `AND estatus_proceso = 'BLOQUEADO'`;

    case 'inconsistencia_tramite':
      return `AND tramite_solicitado = true AND (expediente_actualizado = false OR app_vinculada = false)`;

    case 'criticos':
      // docs incompletos + citas vencidas + 46 vencidos + tramite sin resultado + inconsistencia
      return `
        AND (
          docs_count < :reqLen
          OR (cita_afore IS NOT NULL AND cita_afore < :today)
          OR (fecha_46_dias IS NOT NULL AND fecha_46_dias < :today)
          OR (
            tramite_solicitado = true
            AND (
              resultado_tramite IS NULL
              OR resultado_tramite = ''
              OR resultado_tramite = 'SOLICITADO'
            )
          )
          OR (tramite_solicitado = true AND (expediente_actualizado = false OR app_vinculada = false))
        )
      `;

    case 'docs':
      // lo dejas como "incompletos" (ajusta si luego quieres "con docs" vs "sin docs")
      return `AND docs_count < :reqLen`;

    case 'solicitados':
      // ✅ SOLO los que tienen tramite_solicitado en true
      return `AND tramite_solicitado = true`;

    default:
      return '';
  }
}
