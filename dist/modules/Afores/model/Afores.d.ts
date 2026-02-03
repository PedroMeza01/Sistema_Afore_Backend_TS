import { Model } from 'sequelize-typescript';
export default class Afores extends Model {
    id_afore: string;
    nombre_afore: string;
    activo_afore: boolean;
}
