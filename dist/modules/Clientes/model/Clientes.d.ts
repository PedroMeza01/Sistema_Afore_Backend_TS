import { Model } from 'sequelize-typescript';
import Organizacion from '../../Organizacion/model/Organizacion';
import Asesor from '../../Asesores/model/Asesor';
export default class Cliente extends Model {
    id_cliente: string;
    id_organizacion: string;
    organizacion?: Organizacion;
    id_asesor: string;
    asesor?: Asesor;
    nombre_cliente: string;
    apellido_pat_cliente: string;
    apellido_mat_cliente: string;
    curp_cliente: string;
    nss_cliente: string;
    rfc_cliente: string;
    telefono_cliente: string;
    email_cliente: string;
    activo: boolean;
    observaciones: string;
}
