import { Transaction } from 'sequelize';
import { ICrearOrganizacionDTO } from '../interface/Organizacion.interface';
import Organizacion from '../model/Organizacion';
export declare const OrganizacionRepository: {
    getAll: (includeInactivas?: boolean) => Promise<Organizacion[]>;
    getById: (id_organizacion: string, options?: {
        transaction?: Transaction;
    }) => Promise<Organizacion>;
    existsByRFC: (rfc_organizacion: string, excludeId?: string) => Promise<boolean>;
    create: (data: ICrearOrganizacionDTO, options?: {
        transaction?: Transaction;
    }) => Promise<Organizacion>;
    updateById: (id_organizacion: string, data: any, options?: {
        transaction?: Transaction;
    }) => Promise<Organizacion>;
    setStatus: (id_organizacion: string, estatus_organizacion: boolean, options?: {
        transaction?: Transaction;
    }) => Promise<[affectedCount: number]>;
};
