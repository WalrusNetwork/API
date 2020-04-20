import {
  DefaultScope,
  Table,
  Column,
  Model,
  PrimaryKey,
  HasOne,
  Default,
  DataType,
  BelongsToMany,
  AfterUpdate,
  AfterFind,
  HasMany,
} from "sequelize-typescript";

import Ares from "./ares";
import BlogPost from "./blogpost";
import Group from "./group";
import Membership from "./membership";
import Permissions from "./permissions";

@DefaultScope(() => ({
  include: [
    {
      model: Ares,
    },
    {
      model: Group,
    },
  ],
}))
@Table
export default class User extends Model<User> {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  uuid!: string;

  @Column
  username!: string;

  @Default(false)
  @Column
  online!: boolean;

  @Column
  timePlayed!: number;

  @Column
  usernameAcquisitionDate!: Date;

  @Column
  registered!: boolean;

  @Column
  verificationToken!: string;

  @Default(0)
  @Column
  count!: number;

  @Column
  email!: string;

  @Column
  password!: string;

  @HasOne(() => Ares)
  ares!: Ares;

  @HasMany(() => BlogPost)
  blogposts!: BlogPost[];

  @Default("")
  @Column({
    type: DataType.VIRTUAL,
  })
  flair!: string;

  @Default("")
  @Column({
    type: DataType.VIRTUAL,
  })
  tag!: string;

  @Default([""])
  @Column({
    type: DataType.VIRTUAL,
  })
  permissions!: Permissions[] | string[];

  @Default([""])
  @Column({
    type: DataType.VIRTUAL,
  })
  apiPermissions!: string[];

  @BelongsToMany(
    () => Group,
    () => Membership
  )
  groups!: Group[];

  @Column
  role!: string;

  @AfterUpdate
  @AfterFind
  static async getDefaultGroup(instance: User) {
    const group = await Group.findOne({ where: { name: "@default" } });
    if (!group) throw new Error("There is no default group for some reason...");
    instance.groups.push(group);
  }

  @AfterUpdate
  @AfterFind
  static getGroupAttributes(instance: User) {
    if (instance && instance.groups && instance.groups.length > 0) {
      const max = instance.groups.reduce(function(prev, current) {
        if (+current.priority > +prev.priority) {
          return current;
        } else {
          return prev;
        }
      });

      instance.flair = max.flair;
      instance.tag = max.tag;

      const permissions: Permissions[] = [];
      const apiPermissions: string[] = [];
      for (const group of instance.groups) {
        permissions.push(...group.permissions);
        if (group.apiPermissions) apiPermissions.push(...group.apiPermissions);
      }

      instance.permissions = permissions;
      instance.apiPermissions = apiPermissions;
    }
  }
}
