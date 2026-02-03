import { ICreateUsuario, IIniciarSesion } from '../interface/Auth.interface';
export declare const AuthService: {
    createEmpleado: (data: ICreateUsuario) => Promise<import("../model/Usuarios").default>;
    iniciarSesion: (data: IIniciarSesion) => Promise<{
        token: string;
        rol: number;
    }>;
    getAll: () => Promise<import("../model/Usuarios").default[]>;
};
