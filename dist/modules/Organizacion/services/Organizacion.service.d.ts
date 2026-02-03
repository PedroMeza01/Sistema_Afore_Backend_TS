import { ICrearOrganizacionDTO } from '../interface/Organizacion.interface';
export declare const OrganizacionService: {
    create: (data: ICrearOrganizacionDTO) => Promise<import("../model/Organizacion").default>;
    getAll: (includeInactivas?: boolean) => Promise<import("../model/Organizacion").default[]>;
    getById: (id_organizacion: string) => Promise<import("../model/Organizacion").default>;
};
