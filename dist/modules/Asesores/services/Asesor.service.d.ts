import { Transaction } from 'sequelize';
import { ICreateAsesorDTO, IUpdateAsesorDTO } from '../interface/Asesor.interface';
export declare class AsesorService {
    static create(data: ICreateAsesorDTO, id_organizacion: string, tx?: Transaction): Promise<import("../model/Asesor").default>;
    static getAll(id_organizacion: string): Promise<import("../model/Asesor").default[]>;
    static getById(id_asesor: string, id_organizacion: string): Promise<import("../model/Asesor").default>;
    static updateById(id_asesor: string, id_organizacion: string, data: IUpdateAsesorDTO, tx?: Transaction): Promise<import("../model/Asesor").default>;
    static toggleActivo(id_asesor: string, id_organizacion: string, tx?: Transaction): Promise<import("../model/Asesor").default>;
}
