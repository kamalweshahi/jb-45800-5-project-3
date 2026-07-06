import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import Like from './Like'

@Table({ tableName: 'vacations', underscored: true })
export default class Vacation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(120))
  declare destination: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  declare startDate: string

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  declare endDate: string

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare price: string

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare imageName: string

  @HasMany(() => Like, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare likes: Like[]
}
