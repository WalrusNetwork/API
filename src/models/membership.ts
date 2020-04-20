import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";

import User from "./user";
import Group from "./group";

@Table
export default class Membership extends Model<Membership> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  uuid!: string;

  @ForeignKey(() => Group)
  @Column
  groupId!: number;
}
