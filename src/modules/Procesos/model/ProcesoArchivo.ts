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

import Proceso from './Proceso';

@Table({
  tableName: 'proceso_archivo',
  timestamps: true
})
export default class ProcesoArchivo extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_proceso_archivo: string;

  @ForeignKey(() => Proceso)
  @Index
  @Column(DataType.UUID)
  declare id_proceso: string;

  @BelongsTo(() => Proceso)
  declare proceso?: Proceso;

  @Index
  @Column(DataType.STRING(30))
  declare categoria: string;

  @Column(DataType.STRING(255))
  declare nombre_original: string;

  @Column(DataType.STRING(120))
  declare mime_type: string;

  @Column(DataType.BIGINT)
  declare tamano_bytes: number;

  @Column(DataType.STRING(80))
  declare storage_provider: string | null;

  @Column(DataType.STRING(100))
  declare storage_bucket: string | null;

  @Column(DataType.STRING(500))
  declare storage_path: string;

  @Column(DataType.TEXT)
  declare public_url: string | null;

  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}
