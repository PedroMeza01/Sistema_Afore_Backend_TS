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



@Table({
  tableName: 'usuario',
  timestamps: true
})
export default class Usuario extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_usuario: string;

  @ForeignKey(() => Organizacion)
  @Index
  @Column(DataType.UUID)
  declare id_organizacion: string;

  @BelongsTo(() => Organizacion)
  declare organizacion?: Organizacion;

  @Column(DataType.STRING(100))
  declare nombre_usuario: string;

  @Column(DataType.STRING(100))
  declare apellido_pat_usuario: string;

  @Column(DataType.STRING(100))
  declare apellido_mat_usuario: string;

  @Index
  @Column(DataType.STRING(15))
  declare username: string;

  @Column(DataType.STRING(255))
  declare password_hash: string;


  @Column(DataType.INTEGER)
  declare rol_usuario: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}
