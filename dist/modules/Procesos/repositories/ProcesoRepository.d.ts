import { Transaction } from 'sequelize';
import { ICreateProcesoDTO, IUpdateProcesoDTO } from '../interface/Proceso.interface';
import Proceso from '../model/Proceso';
import ProcesoArchivo from '../model/ProcesoArchivo';
type FindArchivoByIdInput = {
    id_proceso_archivo: string;
    id_organizacion?: string;
};
type UpdateArchivoInput = {
    id_proceso_archivo: string;
    id_organizacion?: string;
    categoria: string | null;
    nombre_original: string;
    mime_type: string;
    tamano_bytes: number;
    storage_provider: string;
    storage_bucket: string | null;
    storage_path: string;
    public_url: string | null;
    activo: boolean;
};
type GetSnapshotParaCierreInput = {
    id_proceso: string;
    id_cliente?: string;
    id_organizacion?: string;
};
export type ProcesoCierreSnapshot = {
    proceso: Proceso;
    archivos: ProcesoArchivo[];
};
type DeleteByProcesoInput = {
    id_proceso: string;
    id_organizacion?: string;
    transaction?: Transaction;
};
type DeleteProcesoInput = {
    id_proceso: string;
    id_organizacion?: string;
    transaction?: Transaction;
};
export declare const ProcesoRepository: {
    create: (data: ICreateProcesoDTO, id_organizacion: string) => Promise<Proceso>;
    findById: (id_proceso: string) => Promise<Proceso>;
    update: (id_proceso: string, data: IUpdateProcesoDTO) => Promise<Proceso>;
    listByCliente: (id_cliente: string) => Promise<Proceso[]>;
    findArchivoById: (input: FindArchivoByIdInput) => Promise<ProcesoArchivo>;
    createArchivo: (data: Partial<ProcesoArchivo>) => Promise<ProcesoArchivo>;
    listArchivos: (id_proceso: string) => Promise<ProcesoArchivo[]>;
    updateArchivo: (input: UpdateArchivoInput) => Promise<ProcesoArchivo>;
    getSnapshotParaCierre: (input: GetSnapshotParaCierreInput) => Promise<ProcesoCierreSnapshot | null>;
    deleteArchivosByProceso: (input: DeleteByProcesoInput) => Promise<number>;
    deleteProceso: (input: DeleteProcesoInput) => Promise<number>;
};
export {};
