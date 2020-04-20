import {
  DefaultScope,
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Default,
  BelongsToMany,
  HasMany,
  DataType,
} from "sequelize-typescript";

import User from "./user";
import Membership from "./membership";
import Permissions from "./permissions";

@DefaultScope(() => ({
  order: [["priority", "DESC"]],
  include: [
    {
      model: Permissions,
      required: false,
    },
  ],
}))
@Table
export default class Group extends Model<Group> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  priority!: number;

  @Default(false)
  @Column
  staff!: boolean;

  @Default("")
  @Column
  tag!: string;

  @Default("")
  @Column
  flair!: string;

  @Column
  badge!: string;

  @Column
  badgeColor!: string;

  @Column
  badgeTextColor!: string;

  @BelongsToMany(
    () => User,
    () => Membership
  )
  users!: User[];

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  apiPermissions!: string[];

  @HasMany(() => Permissions)
  permissions!: Permissions[];
}
