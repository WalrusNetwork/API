import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  Default,
} from "sequelize-typescript";

import User from "./user";

@Table
export default class Ares extends Model<Ares> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  uuid!: string;

  @BelongsTo(() => User)
  user!: User;

  @Default(0)
  @Column
  wins!: number;

  @Default(0)
  @Column
  losses!: number;

  @Default(0)
  @Column
  kills!: number;

  @Default(0)
  @Column
  deaths!: number;

  @Default(0)
  @Column
  wools!: number;

  @Default(0)
  @Column
  monuments!: number;

  @Default(0)
  @Column
  cores!: number;

  @Default(0)
  @Column
  hills!: number;

  @Default(0)
  @Column
  flags!: number;
}
