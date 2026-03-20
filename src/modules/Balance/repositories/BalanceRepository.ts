// src/modules/Balance/repositories/BalanceRepository.ts
import { QueryTypes } from 'sequelize';
import { dbLocal } from '../../../config/db';
import { BalanceQuery, BalanceItem, BalanceTotales } from '../interface/Balance.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos internos para las filas que devuelve el SQL
// ─────────────────────────────────────────────────────────────────────────────
interface BalanceRow {
  id_proceso:       string;
  cliente:          string;
  asesor:           string;
  cobrado:          string;   // Postgres DECIMAL llega como string
  comision_asesora: string;
  bono_asesora:     string;
  fecha_cobro:      string;
}

interface TotalesRow {
  cobrado:        string;
  comision_total: string;
  bono_total:     string;
}

interface CountRow {
  total: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — convierte string|number|null a número seguro
// ─────────────────────────────────────────────────────────────────────────────
const toNum = (v: string | number | null | undefined): number =>
  parseFloat((v as string) ?? '0') || 0;

// ─────────────────────────────────────────────────────────────────────────────
// Construye los fragmentos WHERE dinámicos
// ─────────────────────────────────────────────────────────────────────────────
function buildWhere(q: BalanceQuery): { sql: string; replacements: Record<string, unknown> } {
  const conditions: string[] = [
    'p.id_organizacion = :id_organizacion',
    'p.fecha_cobro IS NOT NULL',
    'p.monto_cobrar IS NOT NULL',
  ];

  const replacements: Record<string, unknown> = {
    id_organizacion: q.id_organizacion,
  };

  if (q.search?.trim()) {
    conditions.push(
      `LOWER(TRIM(c.nombre_cliente || \' \' || c.apellido_pat_cliente || \' \' || COALESCE(c.apellido_mat_cliente, \'\'))) LIKE LOWER(:searchLike)`
    );
    replacements.searchLike = `%${q.search.trim()}%`;
  }

  if (q.asesor?.trim()) {
    conditions.push('p.id_asesor = :id_asesor');
    replacements.id_asesor = q.asesor.trim();
  }

  if (q.desde?.trim()) {
    conditions.push('p.fecha_cobro >= :desde');
    replacements.desde = q.desde.trim();
  }

  if (q.hasta?.trim()) {
    conditions.push('p.fecha_cobro <= :hasta');
    replacements.hasta = q.hasta.trim();
  }

  return { sql: conditions.join(' AND '), replacements };
}

// ─────────────────────────────────────────────────────────────────────────────
// BASE SELECT — reutilizado en items y totales
// ─────────────────────────────────────────────────────────────────────────────
const BASE_SELECT = `
  FROM proceso p
  JOIN cliente  c ON c.id_cliente = p.id_cliente
  JOIN asesores a ON a.id_asesor  = p.id_asesor
`;

export const BalanceRepository = {
  // ───────────────────────────────────────────────────────────────────────────
  // Consulta paginada de ítems
  // ───────────────────────────────────────────────────────────────────────────
  async getItems(q: BalanceQuery): Promise<BalanceItem[]> {
    const page  = Math.max(1, q.page  ?? 1);
    const limit = Math.max(1, q.limit ?? 10);
    const offset = (page - 1) * limit;

    const { sql: whereSql, replacements } = buildWhere(q);

    const rows = await dbLocal.query<BalanceRow>(
      `
      SELECT
        p.id_proceso,
        TRIM(
          c.nombre_cliente || ' ' || c.apellido_pat_cliente
          || ' ' || COALESCE(c.apellido_mat_cliente, '')
        ) AS cliente,
        TRIM(
          a.nombre_asesor || ' ' || a.apellido_pat_asesor
          || ' ' || COALESCE(a.apellido_mat_asesor, '')
        ) AS asesor,
        COALESCE(p.monto_cobrar,   0)::numeric AS cobrado,
        COALESCE(p.bono_asesora,  0)::numeric AS comision_asesora,
        (COALESCE(p.bono_firma,       0)::numeric
         + COALESCE(p.bono_encuentras, 0)::numeric) AS bono_asesora,
        p.fecha_cobro::text AS fecha_cobro
      ${BASE_SELECT}
      WHERE ${whereSql}
      ORDER BY p.fecha_cobro DESC
      LIMIT  :limit
      OFFSET :offset
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { ...replacements, limit, offset },
      }
    );

    return rows.map(r => ({
      id_proceso:       r.id_proceso,
      cliente:          r.cliente,
      asesor:           r.asesor,
      cobrado:          toNum(r.cobrado),
      comision_asesora: toNum(r.comision_asesora),
      bono_asesora:     toNum(r.bono_asesora),
      fecha_cobro:      r.fecha_cobro,
    }));
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Totales globales (sobre todos los registros que coinciden, sin paginar)
  // ───────────────────────────────────────────────────────────────────────────
  async getTotales(q: BalanceQuery): Promise<BalanceTotales> {
    const { sql: whereSql, replacements } = buildWhere(q);

    const rows = await dbLocal.query<TotalesRow>(
      `
      SELECT
        COALESCE(SUM(p.monto_cobrar::numeric),   0) AS cobrado,
        COALESCE(SUM(p.bono_asesora::numeric),  0) AS comision_total,
        COALESCE(SUM(
          COALESCE(p.bono_firma::numeric,        0)
          + COALESCE(p.bono_encuentras::numeric,  0)
        ), 0) AS bono_total
      ${BASE_SELECT}
      WHERE ${whereSql}
      `,
      {
        type: QueryTypes.SELECT,
        replacements,
      }
    );

    const row = rows[0] ?? { cobrado: '0', comision_total: '0', bono_total: '0' };
    return {
      cobrado:        toNum(row.cobrado),
      comision_total: toNum(row.comision_total),
      bono_total:     toNum(row.bono_total),
    };
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Conteo total de filas (para calcular totalPages)
  // ───────────────────────────────────────────────────────────────────────────
  async getCount(q: BalanceQuery): Promise<number> {
    const { sql: whereSql, replacements } = buildWhere(q);

    const rows = await dbLocal.query<CountRow>(
      `
      SELECT COUNT(*)::int AS total
      ${BASE_SELECT}
      WHERE ${whereSql}
      `,
      {
        type: QueryTypes.SELECT,
        replacements,
      }
    );

    return rows[0]?.total ?? 0;
  },
};
