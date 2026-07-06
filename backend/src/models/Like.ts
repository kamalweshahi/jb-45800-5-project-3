import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import User from './User'
import Vacation from './Vacation'

@Table({ tableName: 'likes', underscored: true })
export default class Like extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare userId: number

  @PrimaryKey
  @ForeignKey(() => Vacation)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare vacationId: number

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Vacation)
  declare vacation: Vacation
}
