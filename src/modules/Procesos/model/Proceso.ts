import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';

import ProcesoArchivo from './ProcesoArchivo';
import Organizacion from '../../Organizacion/model/Organizacion';
import Cliente from '../../Clientes/model/Clientes';
import Afores from '../../Afores/model/Afores';
import Asesor from '../../Asesores/model/Asesor';

@Table({
  tableName: 'proceso',
  timestamps: true
})
export default class Proceso extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_proceso: string;

  // ===== ORGANIZACION =====
  @ForeignKey(() => Organizacion)
  @Column(DataType.UUID)
  declare id_organizacion: string | null;

  @BelongsTo(() => Organizacion, {
    foreignKey: 'id_organizacion',
    targetKey: 'id_organizacion',
    as: 'organizacion'
  })
  declare organizacion?: Organizacion;

  // ===== CLIENTE =====
  @ForeignKey(() => Cliente)
  @Column(DataType.UUID)
  declare id_cliente: string;

  @BelongsTo(() => Cliente, {
    foreignKey: 'id_cliente',
    targetKey: 'id_cliente',
    as: 'cliente'
  })
  declare cliente?: Cliente;

  // ===== AFORE =====
  @ForeignKey(() => Afores)
  @Column(DataType.UUID)
  declare id_afore: string;

  @BelongsTo(() => Afores, {
    foreignKey: 'id_afore',
    targetKey: 'id_afore',
    as: 'afore'
  })
  declare afore?: Afores;

  // ===== ASESOR =====
  @ForeignKey(() => Asesor)
  @Column(DataType.UUID)
  declare id_asesor: string;

  @BelongsTo(() => Asesor, {
    foreignKey: 'id_asesor',
    targetKey: 'id_asesor',
    as: 'asesor'
  })
  declare asesor?: Asesor;

  // ===== RESTO DE CAMPOS =====

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

  // ===== ARCHIVOS =====
  @HasMany(() => ProcesoArchivo, {
    foreignKey: 'id_proceso',
    sourceKey: 'id_proceso',
    as: 'archivos'
  })
  declare archivos?: ProcesoArchivo[];
}
