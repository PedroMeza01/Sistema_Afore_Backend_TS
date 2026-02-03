import { ICreateUsuario } from '../interface/Auth.interface';
import Usuario from '../model/Usuarios';
export declare const AuthRepository: {
    crearUsuario: (data: ICreateUsuario) => Promise<Usuario>;
    actualizarContra: (usuarioweb: string, nuevaContraHasheada: string) => Promise<[affectedCount: number]>;
    getAll: () => Promise<Usuario[]>;
    usuarioPorUser: (username: string) => Promise<Usuario>;
};
