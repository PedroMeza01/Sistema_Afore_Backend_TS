import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  Index
} from 'sequelize-typescript';
import Organizacion from '../../Organizacion/model/Organizacion';
import Asesor from '../../Asesores/model/Asesor';


@Table({
  tableName: 'cliente',
  timestamps: true
})
export default class Cliente extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_cliente: string;

  @ForeignKey(() => Organizacion)
  @Index
  @Column(DataType.UUID)
  declare id_organizacion: string;

  @BelongsTo(() => Organizacion)
  declare organizacion?: Organizacion;

  @ForeignKey(() => Asesor)
  @Index
  @Column(DataType.UUID)
  declare id_asesor: string;

  @BelongsTo(() => Asesor)
  declare asesor?: Asesor;

  @Column(DataType.STRING(100))
  declare nombre_cliente: string;

  @Column(DataType.STRING(100))
  declare apellido_pat_cliente: string;

  @Column(DataType.STRING(100))
  declare apellido_mat_cliente: string;

  @Column(DataType.STRING(18))
  declare curp_cliente: string;

  @Column(DataType.STRING(15))
  declare nss_cliente: string;

  @Column(DataType.STRING(15))
  declare rfc_cliente: string;

  @Column(DataType.STRING(20))
  declare telefono_cliente: string;

  @Column(DataType.STRING(150))
  declare email_cliente: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;

  // En tu diagrama dice "CLIENTE" (error). Debería ser TEXT.
  @Column(DataType.TEXT)
  declare observaciones: string;
}
