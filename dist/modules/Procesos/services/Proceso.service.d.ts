import { ICreateProcesoDTO, IUpdateProcesoDTO, IUploadProcesoArchivoDTO } from '../interface/Proceso.interface';
type FinalizarInput = {
    id_cliente: string;
    id_proceso: string;
    id_organizacion: string;
};
export declare const ProcesoService: {
    list: (input: {
        id_organizacion: string;
        page: number;
        limit: number;
        search?: string;
        f?: string;
    }) => Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            search: string;
            f: string;
        };
    }>;
    calcBono(data: {
        tipo_firma?: string;
        encuesta_aplicada?: boolean;
    }): string;
    finalizarProcesoEnviarCorreoYBorrarTodo: (input: FinalizarInput) => Promise<{
        id_cliente: string;
        id_proceso: string;
        emailedTo: any;
        deletedDb: boolean;
        storageDeleted: boolean;
    }>;
    replaceArchivoSupabase: (input: {
        id_proceso_archivo: string;
        categoria: string | null;
        file: Express.Multer.File;
    }) => Promise<import("../model/ProcesoArchivo").default>;
    create: (data: ICreateProcesoDTO, id_organizacion: string) => Promise<import("../model/Proceso").default>;
    getById: (id_proceso: string) => Promise<import("../model/Proceso").default>;
    update: (id_proceso: string, data: IUpdateProcesoDTO) => Promise<import("../model/Proceso").default>;
    listByCliente: (id_cliente: string) => Promise<import("../model/Proceso").default[]>;
    uploadArchivo: (dto: IUploadProcesoArchivoDTO, file: Express.Multer.File) => Promise<import("../model/ProcesoArchivo").default>;
    listArchivos: (id_proceso: string) => Promise<import("../model/ProcesoArchivo").default[]>;
};
export declare function buildHtml(proc: any): string;
export {};
