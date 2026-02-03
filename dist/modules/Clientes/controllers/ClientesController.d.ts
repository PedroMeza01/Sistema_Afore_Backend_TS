import { Request, Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
export declare class ClientesController {
    static getAll: (req: AuthedRequest, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static create: (req: AuthedRequest, res: Response) => Promise<void>;
    static update: (req: Request, res: Response) => Promise<void>;
    static toggleActivo: (req: Request, res: Response) => Promise<void>;
}
