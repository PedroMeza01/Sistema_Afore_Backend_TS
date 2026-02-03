import { Model } from 'sequelize-typescript';
import Organizacion from '../../Organizacion/model/Organizacion';
import Clientes from '../../Clientes/model/Clientes';
export default class Asesor extends Model {
    id_asesor: string;
    id_organizacion: string;
    organizacion?: Organizacion;
    nombre_asesor: string;
    apellido_pat_asesor: string;
    apellido_mat_asesor: string;
    alias: string;
    porcentaje_comision: number;
    activo: boolean;
    observaciones: string;
    clientes?: Clientes[];
}
