export interface IIniciarSesion {
  username: string;
  password: string;
}

export interface ICambiarContrasena {
  usuarioweb: string;
  contrawebNueva: string;
}

export interface ICreateUsuario {
  id_organizacion: string; // viene del contexto (JWT o creación de org)

  nombre_usuario: string;
  apellido_pat_usuario: string;
  apellido_mat_usuario: string;

  username: string;
  password: string; // plano, NO se guarda directo

  activo?: boolean; // default true

  rol: number;
}
