import { Request, Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
export declare const ProcesoController: {
    list: (req: any, res: Response) => Promise<void>;
    finalizarProceso: (req: AuthedRequest, res: Response) => Promise<void>;
    replaceArchivo: (req: AuthedRequest, res: Response) => Promise<void>;
    create: (req: AuthedRequest, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    listByCliente: (req: Request, res: Response) => Promise<void>;
    uploadArchivo: (req: Request, res: Response) => Promise<void>;
    listArchivos: (req: Request, res: Response) => Promise<void>;
};
