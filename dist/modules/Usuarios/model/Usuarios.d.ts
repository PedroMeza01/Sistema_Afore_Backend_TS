import { Model } from 'sequelize-typescript';
import Organizacion from '../../Organizacion/model/Organizacion';
export default class Usuario extends Model {
    id_usuario: string;
    id_organizacion: string;
    organizacion?: Organizacion;
    nombre_usuario: string;
    apellido_pat_usuario: string;
    apellido_mat_usuario: string;
    username: string;
    password_hash: string;
    rol_usuario: number;
    activo: boolean;
}
