import {
  DefaultScope,
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";
import BlogPostContent from "./blogpostcontent";

@DefaultScope(() => ({
  include: [
    {
      model: User,
    },
    {
      model: BlogPostContent,
    },
  ],
}))
@Table
export default class BlogPost extends Model<BlogPost> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  slug!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  uuid!: string;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => BlogPostContent)
  content!: BlogPostContent[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
