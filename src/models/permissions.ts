import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import Group from "./group";

@Table
export default class Permissions extends Model<Permissions> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  realm!: string;

  @Column
  value!: string;

  @ForeignKey(() => Group)
  @Column
  groupId!: number;

  @BelongsTo(() => Group)
  group!: Group;
}
