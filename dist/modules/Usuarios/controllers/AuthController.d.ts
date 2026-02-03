import type { Request, Response } from 'express';
export declare class AuthController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static createUsuario: (req: Request, res: Response) => Promise<void>;
    static iniciarSesion: (req: Request, res: Response) => Promise<void>;
}
