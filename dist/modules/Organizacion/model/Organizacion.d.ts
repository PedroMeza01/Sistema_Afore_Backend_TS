import { Model } from 'sequelize-typescript';
import Clientes from '../../Clientes/model/Clientes';
import Asesor from '../../Asesores/model/Asesor';
import Usuario from '../../Usuarios/model/Usuarios';
export default class Organizacion extends Model {
    id_organizacion: string;
    nombre_organizacion: string;
    razon_social_organizacion: string;
    estatus_organizacion: boolean;
    rfc_organizacion: string;
    regimen_fisca_organizacion: string;
    uso_cfdi_default_organizacion: string;
    codigo_postal_fiscal_organizacion: string;
    email_contacto_organizacion: string;
    telefono_contacto_organizacion: string;
    direccion_organizacion: string;
    logo_url: string;
    moneda_organizacion: string;
    usuarios?: Usuario[];
    asesores?: Asesor[];
    clientes?: Clientes[];
}
