import { ICreateAforeDTO, IUpdateAforeDTO } from '../interface/Afore.interface';
export declare const AforeService: {
    create: (data: ICreateAforeDTO) => Promise<import("../model/Afores").default>;
    getAll: () => Promise<import("../model/Afores").default[]>;
    getById: (id_afore: string) => Promise<import("../model/Afores").default>;
    update: (id_afore: string, data: IUpdateAforeDTO) => Promise<[affectedCount: number]>;
    actualizarStatus: (id_afore: string) => Promise<import("../model/Afores").default>;
};
