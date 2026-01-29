import { Table, Column, Model, PrimaryKey, DataType, Default, HasMany } from 'sequelize-typescript';
import Clientes from '../../Clientes/model/Clientes';
import Asesor from '../../Asesores/model/Asesor';
import Usuario from '../../Usuarios/model/Usuarios';

@Table({
  tableName: 'organizacion',
  timestamps: true
})
export default class Organizacion extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_organizacion: string;

  @Column(DataType.STRING(150))
  declare nombre_organizacion: string;

  @Column(DataType.STRING(200))
  declare razon_social_organizacion: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare estatus_organizacion: boolean;

  @Column(DataType.STRING(13))
  declare rfc_organizacion: string;

  @Column(DataType.STRING(10))
  declare regimen_fisca_organizacion: string;

  @Column(DataType.STRING(10))
  declare uso_cfdi_default_organizacion: string;

  @Column(DataType.STRING(5))
  declare codigo_postal_fiscal_organizacion: string;

  @Column(DataType.STRING(150))
  declare email_contacto_organizacion: string;

  @Column(DataType.STRING(30))
  declare telefono_contacto_organizacion: string;

  @Column(DataType.STRING(60))
  declare direccion_organizacion: string;

  @Column(DataType.TEXT)
  declare logo_url: string;

  @Default('MXN')
  @Column(DataType.CHAR(3))
  declare moneda_organizacion: string;

  // Associations
  @HasMany(() => Usuario)
  declare usuarios?: Usuario[];

  @HasMany(() => Asesor)
  declare asesores?: Asesor[];

  @HasMany(() => Clientes)
  declare clientes?: Clientes[];
}
