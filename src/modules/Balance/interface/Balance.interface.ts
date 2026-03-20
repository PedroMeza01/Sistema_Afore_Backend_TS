// src/modules/Balance/interface/Balance.interface.ts

export interface BalanceQuery {
  search?:          string;   // búsqueda por nombre de cliente
  asesor?:          string;   // id_asesor (UUID)
  desde?:           string;   // YYYY-MM-DD — límite inferior de fecha_cobro
  hasta?:           string;   // YYYY-MM-DD — límite superior de fecha_cobro
  page?:            number;
  limit?:           number;
  id_organizacion:  string;
}

export interface BalanceItem {
  id_proceso:        string;
  cliente:           string;   // nombre completo del cliente
  asesor:            string;   // nombre completo del asesor
  cobrado:           number;   // monto_cobrar
  comision_asesora:  number;   // comisión por porcentaje (ej. 25.6%)
  bono_asesora:      number;   // suma de bonos extra (firma + encuentras)
  fecha_cobro:       string;   // "YYYY-MM-DD"
}

export interface BalanceTotales {
  cobrado:        number;
  comision_total: number;
  bono_total:     number;
}

export interface BalanceMeta {
  page:       number;
  limit:      number;
  totalItems: number;
  totalPages: number;
}

export interface BalanceResponse {
  items:    BalanceItem[];
  totales:  BalanceTotales;
  meta:     BalanceMeta;
}
