import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
 
} from 'sequelize-typescript';

@Table({
  tableName: 'afores',
  timestamps: true
})
export default class Afores extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id_afore: string;

  @Column(DataType.STRING(60))
  declare nombre_afore: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo_afore: boolean;
}
