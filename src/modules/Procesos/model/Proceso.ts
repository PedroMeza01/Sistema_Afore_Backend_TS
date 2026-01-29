import { Table, Column, Model, PrimaryKey, DataType, Default, HasMany } from 'sequelize-typescript';
import ProcesoArchivo from './ProcesoArchivo';

@Table({
  tableName: 'proceso',
  timestamps: true
})
export default class Proceso extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_proceso: string;

  @Column(DataType.UUID)
  declare id_organizacion: string | null;

  @Column(DataType.UUID)
  declare id_cliente: string;

  @Column(DataType.UUID)
  declare id_afore: string;

  @Column(DataType.UUID)
  declare id_asesor: string;

  @Column(DataType.DATEONLY)
  declare fecha_firma: string | null;

  @Column(DataType.STRING(20))
  declare tipo_firma: string | null;

  @Column(DataType.DATEONLY)
  declare fecha_baja_imss: string | null;

  @Column(DataType.DATEONLY)
  declare fecha_46_dias: string | null;

  @Column(DataType.BOOLEAN)
  declare requiere_cita_afore: boolean;

  @Column(DataType.DATEONLY)
  declare cita_afore: string | null;

  @Column(DataType.STRING(5))
  declare acompanamiento: string | null;

  @Column(DataType.STRING(20))
  declare modo_retiro: string | null;

  @Column(DataType.BOOLEAN)
  declare expediente_actualizado: boolean;

  @Column(DataType.BOOLEAN)
  declare app_vinculada: boolean;

  @Column(DataType.BOOLEAN)
  declare tramite_solicitado: boolean;

  @Column(DataType.STRING(20))
  declare resultado_tramite: string | null;

  @Column(DataType.TEXT)
  declare observacion_tramite: string | null;

  @Column(DataType.BOOLEAN)
  declare listo_para_cobro: boolean;

  @Column(DataType.DATEONLY)
  declare fecha_cobro: string | null;

  @Column(DataType.STRING(20))
  declare tipo_cobro: string | null;

  @Column(DataType.DECIMAL(12, 2))
  declare monto_cobrar: string | null;

  @Column(DataType.DECIMAL(12, 2))
  declare comision_asesora: string | null;

  @Column(DataType.BOOLEAN)
  declare encuesta_aplicada: boolean;

  @Column(DataType.DECIMAL(12, 2))
  declare bono_asesora: string | null;

  @Column(DataType.STRING(20))
  declare estatus_proceso: string | null;

  @Column(DataType.TEXT)
  declare motivo_estatus: string | null;
  
  @HasMany(() => ProcesoArchivo)
  declare archivos?: ProcesoArchivo[];
}
