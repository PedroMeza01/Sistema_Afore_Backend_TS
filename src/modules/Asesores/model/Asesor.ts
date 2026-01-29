import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index
} from 'sequelize-typescript';

import Organizacion from '../../Organizacion/model/Organizacion';
import Clientes from '../../Clientes/model/Clientes';

@Table({
  tableName: 'asesores',
  timestamps: true
})
export default class Asesor extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_asesor: string;

  @ForeignKey(() => Organizacion)
  @Index
  @Column(DataType.UUID)
  declare id_organizacion: string;

  @BelongsTo(() => Organizacion)
  declare organizacion?: Organizacion;

  @Column(DataType.STRING(100))
  declare nombre_asesor: string;

  @Column(DataType.STRING(100))
  declare apellido_pat_asesor: string;

  @Column(DataType.STRING(100))
  declare apellido_mat_asesor: string;

  @Column(DataType.STRING(18))
  declare alias: string;

  @Column(DataType.DECIMAL(4, 2))
  declare porcentaje_comision: number; // sequelize devuelve DECIMAL como string

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;

  // En tu diagrama dice "CLIENTE" (eso parece error). Lo correcto: TEXT.
  @Column(DataType.TEXT)
  declare observaciones: string;

  // Associations
  @HasMany(() => Clientes)
  declare clientes?: Clientes[];
}
