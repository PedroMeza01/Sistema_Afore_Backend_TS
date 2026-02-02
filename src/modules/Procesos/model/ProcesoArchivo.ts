import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
  AllowNull
} from 'sequelize-typescript';

import Proceso from './Proceso';

export type StorageProvider = 'SUPABASE' | 'LOCAL' | 'S3' | 'GCS';

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
  @AllowNull(false)
  @Index('idx_proceso_archivo_id_proceso')
  @Column(DataType.UUID)
  declare id_proceso: string;

  @BelongsTo(() => Proceso)
  declare proceso?: Proceso;

  // Si quieres categorías fijas, cámbialo a ENUM en la migración y aquí mantén STRING
  @AllowNull(false)
  @Index('idx_proceso_archivo_categoria')
  @Column(DataType.STRING(50))
  declare categoria: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare nombre_original: string;

  @AllowNull(false)
  @Column(DataType.STRING(120))
  declare mime_type: string;

  // Postgres BIGINT -> ojo: Sequelize puede retornar string dependiendo config.
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare tamano_bytes: number;

  // Si solo usarás Supabase, puedes dejarlo fijo en "SUPABASE" al insertar
  @AllowNull(false)
  @Column(DataType.STRING(16))
  declare storage_provider: StorageProvider;

  // En Supabase: el bucket (ej. "procesos")
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare storage_bucket: string;

  // Path completo dentro del bucket. Mejor TEXT para no truncar.
  @AllowNull(false)
  @Column(DataType.TEXT)
  declare storage_path: string;

  // Derivable: si el bucket es público, la generas en runtime; si es privado, usas signed URL.
  // La dejo opcional para compat.
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare public_url: string | null;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}
