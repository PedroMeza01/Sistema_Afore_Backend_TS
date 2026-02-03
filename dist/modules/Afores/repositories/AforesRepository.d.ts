import { Transaction } from 'sequelize';
import Afores from '../model/Afores';
export declare const AforeRepository: {
    create: (nombre_afore: string, tx?: Transaction) => Promise<Afores>;
    getAll: () => Promise<Afores[]>;
    findById: (id_afore: string) => Promise<Afores>;
    existsByNombre: (nombre_afore: string, excludeId?: string) => Promise<boolean>;
    updateById: (id_afore: string, nombre_afore: string, tx?: Transaction) => Promise<[affectedCount: number]>;
    cambiarStatusByID: (id_afore: string, tx?: Transaction) => Promise<Afores>;
};
