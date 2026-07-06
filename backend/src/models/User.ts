import { AllowNull, AutoIncrement, Column, DataType, Default, HasMany, Index, Model, PrimaryKey, Table } from 'sequelize-typescript'
import Like from './Like'

export enum Role {
  User = 'user',
  Admin = 'admin'
}

@Table({ tableName: 'users', underscored: true })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare firstName: string

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare lastName: string

  @AllowNull(false)
  @Index({ unique: true })
  @Column(DataType.STRING(255))
  declare email: string

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string

  @AllowNull(false)
  @Default(Role.User)
  @Column(DataType.ENUM(...Object.values(Role)))
  declare role: Role

  @HasMany(() => Like, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare likes: Like[]

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
