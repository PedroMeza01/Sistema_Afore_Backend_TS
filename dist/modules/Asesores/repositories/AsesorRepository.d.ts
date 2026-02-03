import { Transaction } from 'sequelize';
import Asesor from '../model/Asesor';
import { ICreateAsesorDTO } from '../interface/Asesor.interface';
export declare const AsesorRepository: {
    create: (data: ICreateAsesorDTO, tx?: Transaction) => Promise<Asesor>;
    findAllByOrganizacion: (id_organizacion: string) => Promise<Asesor[]>;
    findByIdScoped: (id_asesor: string, id_organizacion: string) => Promise<Asesor>;
    updateByIdScopedReturning: (id_asesor: string, id_organizacion: string, data: any, tx?: Transaction) => Promise<{
        count: number;
        row: Asesor;
    }>;
    toggleActivoScopedReturning: (id_asesor: string, id_organizacion: string, tx?: Transaction) => Promise<{
        count: number;
        row: Asesor;
    }>;
};
