// src/modules/Balance/services/Balance.service.ts
import { BalanceQuery, BalanceResponse } from '../interface/Balance.interface';
import { BalanceRepository } from '../repositories/BalanceRepository';

export const BalanceService = {
  async getBalance(query: BalanceQuery): Promise<BalanceResponse> {
    if (!query.id_organizacion) {
      throw new Error('id_organizacion requerido');
    }

    const page  = Math.max(1, query.page  ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 10));

    const normalizedQuery: BalanceQuery = { ...query, page, limit };

    // Las tres consultas pueden correr en paralelo
    const [items, totales, totalItems] = await Promise.all([
      BalanceRepository.getItems(normalizedQuery),
      BalanceRepository.getTotales(normalizedQuery),
      BalanceRepository.getCount(normalizedQuery),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage   = Math.min(page, totalPages);

    return {
      items,
      totales,
      meta: { page: safePage, limit, totalItems, totalPages },
    };
  },
};
