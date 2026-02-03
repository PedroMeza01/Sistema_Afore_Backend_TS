import { Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
export declare class AforeController {
    static create: (req: AuthedRequest, res: Response) => Promise<void>;
    static getAll: (req: AuthedRequest, res: Response) => Promise<void>;
    static getById: (req: AuthedRequest, res: Response) => Promise<void>;
    static update: (req: AuthedRequest, res: Response) => Promise<void>;
    static actualizarStatus: (req: AuthedRequest, res: Response) => Promise<void>;
}
